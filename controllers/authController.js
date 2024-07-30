const { promisify } = require('util');
const User = require('./../models/userModel');
const sendEmail = require('./../utils/email');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECREAT, {
    expiresIn: process.env.JWT_EXPIRES
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  });
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role
  });
  // const token = signToken(newUser._id);
  // res.status(201).json({
  //   status: 'success',
  //   token,
  //   data: { user: newUser }
  // });
  createSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Invalid email or password', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('incorrect email or password', 404));
  }
  createSendToken(user, 201, req, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError('you are not login! please login to get access', 404)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECREAT);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new AppError('the user belonging to the token was not found', 401)
    );
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    next(new AppError('user changed password! please login again', 401));
  }

  req.user = currentUser;
  next();
});

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECREAT
      );
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('you dont have permision to do this', 403));
    }
    next();
  };
};

exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('there was no such user', 400));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password and submit your patch password request with ${resetUrl} and reset your password.\n if not please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'your password reset token is valid for 10 min',
      message
    });
    res.status(200).json({
      status: 'success',
      message: 'Your password reset token to your email'
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('there was an error sending password reset email', 500)
    );
  }
};

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.id)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpire: { $gt: Date.now() }
  });
  if (!user) {
    return next(new AppError('Token is invalid or expired', 400));
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new AppError('Passwords do not match', 400));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  await user.save();
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('password');
  if (!user) {
    return next(new AppError('user not found', 400));
  }
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('your current password is not correct', 401));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.passwordConfirm;
  await user.save();
  createSendToken(user, 200, req, res);
});

const { promisify } = require('util');
const User = require('./../models/userModel');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const { decode } = require('punycode');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECREAT, {
    expiresIn: process.env.JWT_EXPIRES
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
  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: { user: newUser }
  });
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
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
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

exports.ristrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('you dont have permision to do this', 403));
    }
    next();
  };
};

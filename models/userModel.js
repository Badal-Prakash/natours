const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: 'String',
    required: [true, 'please enter your name']
  },
  email: {
    type: 'String',
    required: [true, 'please enter your email'],
    lowercase: true
  },
  role: {
    type: 'String',
    enum: ['admin', 'user', 'lead-guide', 'guide'],
    default: 'user'
  },
  passwordChangedAt: { type: Date },
  password: {
    type: 'String',
    required: [true, 'please enter your password'],
    select: false
  },
  confirmPassword: {
    type: 'String',
    required: [true, 'please enter your confirm password'],
    validate: {
      // this will only work on save and create
      validator: function(el) {
        return this.password === el;
      },
      message: 'Please enter your confirm password'
    }
  },
  photo: { type: 'String' }
});

UserSchema.pre('save', async function(next) {
  // run only one pasword is changed
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

UserSchema.methods.correctPassword = async function(
  candidatepassword,
  userPassword
) {
  return await bcrypt.compare(candidatepassword, userPassword);
};

UserSchema.methods.changedPasswordAfter = function(JWTTIMESTAMP) {
  if (this.passwordChangedAt) {
    const chnagedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTIMESTAMP < chnagedTimestamp;
  }
  return false;
};

const User = mongoose.model('User', UserSchema);
module.exports = User;

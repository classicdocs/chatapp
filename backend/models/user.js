const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  firstName: String,
  lastName: String,
  password: String,
}, {timestamps: true});


const User = mongoose.model('User', UserSchema, 'users');

module.exports = User;
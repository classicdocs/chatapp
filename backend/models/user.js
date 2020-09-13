const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  firstName: String,
  lastName: String,
  password: String,
  profileImageUrl: String,
  friends: [],
  sentFriendRequests: [],
  pendingFriendRequests: [],
  inbox: [],
  socketId: String
}, {timestamps: true});


const User = mongoose.model('User', UserSchema, 'users');

function toDto(user) {
  return {
    id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    profileImageUrl: user.profileImageUrl
  }
}

function toDtos(users) {
  return users.map(user => toDto(user));
}

module.exports = {User, toDtos, toDto};


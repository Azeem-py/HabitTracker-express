const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: String,

  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    immutable: true,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
})

const tokenSchema = new mongoose.Schema({
  refreshToken: {
    type: String,
    required: true,
  },
  lastAccessToken: String,
})

const user = mongoose.model('user', userSchema)
const tokenModel = mongoose.model('token', tokenSchema)

module.exports = { user, tokenModel }

require('dotenv').config()

const { user, tokenModel } = require('../schema/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const emailUnique = async (email) => {
  const User = await user.exists({ email })
  return User
}

const generateAccessToken = (email) => {
  return jwt.sign(email, process.env.ACCESS_TOKEN_SECRET)
}

const generateRefreshToken = (email) => {
  return jwt.sign(email, process.env.REFRESH_TOKEN_SECRET)
}

const signup = async (req, res) => {
  const { name, email, password, password2 } = req.body
  if (!name && !email && !password && !password2) return res.sendStatus(400)
  if (password !== password) return res.sendStatus(404)

  if ((await emailUnique(email)) !== null)
    return res
      .status(400)
      .json({ email: 'email has been used by another user' })

  const hashedPassword = await bcrypt.hash(password, 10)
  console.log(hashedPassword)

  try {
    const newUser = await user.create({
      name,
      email,
      password: hashedPassword,
    })

    await newUser.save()
    // console.log(newUser)
    return res.json(newUser)
  } catch (error) {
    console.log(error.message)
  }
}

const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).send('Email and password field required!')
  try {
    const User = await user.findOne({ email }, { password: 1, name: 1 })
    const _id = User['_id']
    // console.log(hashedPassword)
    const isMatch = await bcrypt.compare(password, User['password'])
    if (!isMatch)
      return res.status(403).json({ password: 'incorrect password' })
    const accessToken = generateAccessToken({ _id })
    const refreshToken = generateRefreshToken({ _id })
    const token = await tokenModel.create({
      user: User['_id'],
      refreshToken,
      lastAccessToken: accessToken,
    })
    await token.save()
    return res.json({ accessToken, name: User['name'] })
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = { signup, login }

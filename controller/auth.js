const user = require('../schema/user')
const bcrypt = require('bcrypt')

const emailUnique = async (email) => {
  const User = await user.exists({ email })
  return User
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

module.exports = { signup }

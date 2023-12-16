const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/HabitTracker')
const user = require('./schema/user')
const { signup } = require('./controller/auth')

const app = express()
app.use(express.json())
const authRouter = express.Router()

authRouter.post('/signup', signup)

app.use('/auth', authRouter)

app.listen(3000, () => console.log('listening at 3000'))

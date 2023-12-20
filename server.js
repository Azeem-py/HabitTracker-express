const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/HabitTracker')
const user = require('./schema/user')
const { signup, login } = require('./controller/auth')
const { createHabit } = require('./controller/habit')
const authenticateToken = require('./middleware/authenticateToken')

const app = express()
app.use(express.json())
const authRouter = express.Router()

authRouter.post('/signup', signup)
authRouter.post('/login', login)

app.use('/auth', authRouter)

app.get('/create', authenticateToken, createHabit)
// app.get('/create', authenticateToken, createHabit)

app.listen(3000, () => console.log('listening at 3000'))

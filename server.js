const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

mongoose.connect('mongodb://localhost/HabitTracker')
const { signup, login } = require('./controller/auth')
const {
  createHabit,
  TodaysHabits,
  dashboardData,
} = require('./controller/habit')
const authenticateToken = require('./middleware/authenticateToken')

const app = express()
app.use(cors())
app.use(express.json())
const authRouter = express.Router()

authRouter.post('/signup', signup)
authRouter.post('/login', login)

app.use('/auth', authRouter)

app.post('/create-habit', authenticateToken, createHabit)
app.get('/today-habits', authenticateToken, TodaysHabits)
app.get('/dashboard', authenticateToken, dashboardData)

app.listen(3000, () => console.log('listening at 3000'))

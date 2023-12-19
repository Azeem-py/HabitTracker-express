require('dotenv').config()
const jwt = require('jsonwebtoken')
const { Habit } = require('../schema/habit')
const { user } = require('../schema/user')

const createHabit = async (req, res) => {
  const { name, goal, days, interval } = req.body
  if (!name || !goal || !days || !interval)
    return res.status(400).json({ error: 'all fields required' })
  try {
    const newHabit = await Habit.create({
      name,
      goal,
      days,
      interval,
      user: req.user['_id'],
    })
    await newHabit.save()
    return res.json({ newHabit })
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = { createHabit }

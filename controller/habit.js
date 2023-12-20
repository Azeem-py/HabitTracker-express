require('dotenv').config()
const jwt = require('jsonwebtoken')
const { Habit, Schedule } = require('../schema/habit')
const { user } = require('../schema/user')
const calculateHabitSchedule = require('../functions/habitSchedule')

const createHabit = async (req, res) => {
  const { name, goal, days, interval } = req.body
  let startDate = req.body.startDate
  if (!startDate) startDate = new Date()

  if (!name || !goal || !days || !interval)
    return res.status(400).json({ error: 'all fields required' })

  const habitSchedule = calculateHabitSchedule(startDate, interval, days)

  try {
    const newHabit = await Habit.create({
      name,
      goal,
      days,
      interval,
      user: req.user['_id'],
    })
    await newHabit.save()
    try {
      const newSchedule = await Schedule.insertMany(habitSchedule)
      console.log(newSchedule)
      // await newSchedule.save()
      for (const schedule of newSchedule) {
        schedule['user'] = req.user['_id']
        schedule['habit'] = newHabit['_id']
        await schedule.save()
      }
      return res.json({ newHabit, newSchedule })
    } catch (error) {
      console.log(error.message)
    }
  } catch (error) {
    console.log(error.message)
  }
}

const TodaysHabit = async (req, res) => {
  const User = await user.find({ _id: req.user['_id'] })
  const habits = await Habit.find({ user: User })
  console.log(habits)
}

module.exports = { createHabit }

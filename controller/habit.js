require('dotenv').config()
const { Habit, Schedule } = require('../schema/habit')
const { user } = require('../schema/user')
const calculateHabitSchedule = require('../functions/habitSchedule')

const createHabit = async (req, res) => {
  const { name, goal, days, interval } = req.body
  let startDate = req.body.startDate
  if (!startDate) {
    startDate = new Date().setUTCHours(0, 0, 0, 0)
  }
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

const TodaysHabits = async (req, res) => {
  const User = await user.find({ _id: req.user['_id'] })
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  const habits = await Schedule.find({ user: User, date: today }, { habit: 1 })
    .populate('habit')
    .limit(3)
  res.json({ habits })
}

const dashboardData = async (req, res) => {
  const User = await user.find({ _id: req.user['_id'] })
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  const habits = await Schedule.find(
    { user: User, date: today },
    { habit: 1 }
  ).populate({
    path: 'habit',
    select: 'name goal',
  })

  // const goals = habits.map(async (habit) => {
  //   return { name, count, done }
  // })

  const generateGoalData = async () => {
    const goals = []
    for (const habit of habits) {
      const name = habit['habit']['goal']
      const habitID = habit['habit']['_id']
      const count = await Schedule.countDocuments({ habit: habitID })
      const done = await Schedule.countDocuments({
        habit: habitID,
        done: true,
      })
      goals.push({ name, count, done })
    }
    return goals
  }

  const goals = await generateGoalData()
  console.log(goals)

  res.json({ habits, goals })
}
module.exports = { createHabit, TodaysHabits, dashboardData }

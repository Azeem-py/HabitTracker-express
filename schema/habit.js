const mongoose = require('mongoose')

const HabitSchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'user',
  },
  name: String,
  goal: String,
  startingDate: {
    type: Date,
    required: true,
    default: new Date(),
  },
  days: Number,
  interval: Number,
})

const ScheduleSchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'user',
  },
  habit: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Habit',
  },
  date: Date,
  done: Boolean,
})

const Habit = mongoose.model('Habit', HabitSchema)
const Schedule = mongoose.model('Schedule', ScheduleSchema)
module.exports = { Habit, Schedule }

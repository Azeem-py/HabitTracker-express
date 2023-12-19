const mongoose = require('mongoose')

const HabitSchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'user',
  },
  name: String,
  goal: String,
  days: Number,
  interval: Number,
})

const Habit = mongoose.model('Habit', HabitSchema)
module.exports = { Habit }

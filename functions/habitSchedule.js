const calculateHabitSchedule = (startingDate, interval, totalDays) => {
  const schedules = []
  let currentDate = new Date(startingDate)
  let endDate = new Date(startingDate)
  endDate.setDate(currentDate.getDate() + totalDays)

  while (currentDate <= endDate) {
    schedules.push({
      date: new Date(currentDate),
      done: false,
    })
    currentDate.setDate(currentDate.getDate() + interval + 1)
  }

  return schedules
}

module.exports = calculateHabitSchedule

// const startingDate = new Date('2023-01-10')
// const intervalDays = 5
// const totalDays = 30

// const habitSchedule = calculateHabitSchedule(
//   startingDate,
//   intervalDays,
//   totalDays
// )

// console.log(habitSchedule)
// console.log(habitSchedule.length)

import moment from 'moment'

const config = process.env
const appointmentDuration = config.APPOINTMENT_DURATION
const appointmentInterval = config.APPOINTMENT_INTERVAL

// Dynamically generate desired time slots
export const generateTimeSlots = (date) => {
  let timeSlots = []
  const startTime = moment(config.START_TIME, config.TIME_FORMAT)
  const endTime = moment(config.END_TIME, config.TIME_FORMAT)

  let startDateTime = moment(date).set({
    hour: startTime.get('hour'),
    minute: startTime.get('minute'),
    second: startTime.get('second')
  })

  let endDateTime = moment(date).set({
    hour: endTime.get('hour'),
    minute: endTime.get('minute'),
    second: endTime.get('second')
  })

  while (startDateTime < endDateTime) {
    timeSlots.push({
      start: startDateTime.toDate(),
      end: startDateTime.add(appointmentDuration, 'minutes').toDate()
    })
    startDateTime.add(appointmentInterval, 'minutes')
  }
  return timeSlots
}

// Count total number of bookable time slots
export const getTotalTimeSlots = () => {
  let count = 0
  const startTime = moment(config.START_TIME, config.TIME_FORMAT)
  const endTime = moment(config.END_TIME, config.TIME_FORMAT)

  while (startTime < endTime) {
    startTime.add(appointmentDuration, 'minutes')
    startTime.add(appointmentInterval, 'minutes')
    count++
  }
  return count
}

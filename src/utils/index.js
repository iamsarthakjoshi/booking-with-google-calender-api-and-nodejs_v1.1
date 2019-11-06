import moment from 'moment'

/**
 *  Filter events by excluding weekdays and time before
 *  9AM and after 6PM
 * @param {Google Calendar Event's items} items
 */
export const getFilteredBookedAppoinments = (items) => {
  return items.filter(
    (data) =>
      data.status === 'confirmed' &&
      (moment(data.start.dateTime).weekday() !== 0 &&
        moment(data.start.dateTime).weekday() !== 6) &&
      (moment(data.start.dateTime).hours() >= 9 &&
        moment(data.start.dateTime).hours() <= 18)
  )
}

export const getStartDate = (year, month, day) => {
  return new Date(year, month - 1, day)
}

export const getEndDate = (year, month, day) => {
  return new Date(year, month, day)
}

export const getDateTime = (year, month, day, hour, minute) => {
  return new Date(year, month - 1, day, hour, minute)
}

export const getEndDateTime = (year, month, day, hour, minute) => {
  const appointmentDuration = parseInt(process.env.APPOINTMENT_DURATION)
  const tempDate = new Date(year, month - 1, day, hour, minute)
  tempDate.setMinutes(tempDate.getMinutes() + appointmentDuration)
  return tempDate
}

/**
 * Format full iso date-time to only date, for eg:
 * formatted date would be 2019-10-16
 * @param {Date} dateTime
 */
export const formatFullDateTime = (dateTime) =>
  moment(dateTime).format('YYYY-MM-DD')

export const hasDatesMatched = (d1, d2) => {
  return moment(formatFullDateTime(d1).isSame(formatFullDateTime(d2)))
}

export const formatToISO = (dateTime) => new Date(dateTime)

/**
 *
 * @param {Date} dateTime
 * @param {Time String} timeString
 */
export const getModifiedDate = (dateTime, timeString) => {
  const config = process.env
  const time = moment(timeString, config.TIME_FORMAT)

  return moment(dateTime)
    .set({
      hour: time.get('hour'),
      minute: time.get('minute'),
      second: time.get('second')
    })
    .toDate()
}

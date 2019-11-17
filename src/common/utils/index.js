import moment from 'moment'

import { validateDateTime } from 'helpers/date-time-validation'

/**
 *  Filter events by excluding weekdays and time before
 *  9AM and after 6PM
 * @param {Google Calendar Event's items} items
 */
export const getFilteredBookedAppoinments = (items) => {
  return items.filter(
    (data) =>
      data.status === 'confirmed' &&
      moment(data.start.dateTime).weekday() !== 0 &&
      moment(data.start.dateTime).weekday() !== 6 &&
      moment(data.start.dateTime).hours() >= 9 &&
      moment(data.start.dateTime).hours() <= 18
  )
}

/* Return appointment initial ISO date */
export const getStartDate = (year, month, day) => {
  validateDateTime(month, day)
  return new Date(year, month - 1, day)
}

/* Return appointment final ISO date */
export const getEndDate = (year, month, day) => {
  validateDateTime(month, day)
  return new Date(year, month, day)
}

/* Return ISO date-time */
export const getDateTime = (year, month, day, hour, minute) => {
  validateDateTime(month, day, hour, minute)
  return new Date(year, month - 1, day, hour, minute)
}

/* Return ISO date-time with additional 40 minutes */
export const getEndDateTime = (year, month, day, hour, minute) => {
  validateDateTime(month, day, hour, minute)
  const appointmentDuration = parseInt(process.env.APPOINTMENT_DURATION)
  const tempDate = new Date(year, month - 1, day, hour, minute)
  /* Add 40 mins duration */
  tempDate.setMinutes(tempDate.getMinutes() + appointmentDuration)
  return tempDate
}

/**
 * Re-Format iso date-time to ISO 8601
 * @param {Date} dateTime
 */
export const formatToISO = (dateTime) => new Date(dateTime)

/**
 * Modifiy given date with provided time string
 * @param {Date} dateTime
 * @param {string} timeString
 * @returns {moment}
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

/**
 * Return date in YYYY-MM-DD format
 * @param {Date} date
 */
export const getFormattedDate = (date) => moment(date).format('YYYY-MM-DD')

import moment from 'moment'

import { throwError } from 'handler/error-handler'

/**
 * Check if given date falls on weekends
 * and throw error if it does
 * @param {Date} dateTime
 */
export const validateWeekends = (dateTime) => {
  if (isWeekends(dateTime))
    throwError(
      501,
      'DateTime Error',
      'Appointments can only be booked during weekdays'
    )()
}

/**
 * Check if given date falls on past date and time
 * and throw error if it does
 * @param {Date} dateTime
 */
export const validatePastDateTime = (dateTime) => {
  console.log(moment(dateTime).toDate(), moment().toDate())
  if (moment(dateTime).isBefore(moment())) {
    throwError(501, 'DateTime Error', 'No time slots available for past')()
  }
}

/**
 * Return true if given date falls on weekends
 * @param {Date} dateTime
 */
export const isWeekends = (dateTime) => {
  return moment(dateTime).weekday() === 0 || moment(dateTime).weekday() === 6
}

/**
 * Sanitize month, day, hour and minute
 * @param {*} month
 * @param {*} day
 * @param {*} hour
 * @param {*} minute
 */
export const validateDateTime = (month, day, hour, minute) => {
  if (month !== undefined && month > 12)
    throwError(
      501,
      'DateTime Error',
      'Month can only be less than or up to 12 and greater than 0'
    )()
  if (day !== undefined && day > 31)
    throwError(
      501,
      'DateTime Error',
      'Month can only be less than or up to 31 and greater than 0'
    )()
  if (hour !== undefined && hour > 24)
    throwError(
      501,
      'DateTime Error',
      'Hour can only be less than or up to 24 and greater than 0'
    )()
  if (minute !== undefined && minute > 59)
    throwError(
      501,
      'DateTime Error',
      'Minute can only be less than or up to 59 and greater than 0'
    )()
}

import moment from 'moment'
import { isEmpty } from 'loadsh'

import { getModifiedDate } from 'common/utils'
import { throwError } from 'handler/error-handler'
import { getAvailableTimeSlots } from 'helpers/timeslots-impl'

/* Instantiate environment variable */
const config = process.env

/**
 * Check if requested booking time statisfy our terms and conditions
 * @param {Date} appointmentBookingTime
 */
export const isBookingTimeValid = async (appointmentBookingTime) => {
  const startTime = appointmentBookingTime
  const apptStartTime = getModifiedDate(startTime, config.START_TIME)
  const apptEndTime = getModifiedDate(startTime, config.END_TIME)

  /* check every given conditions and set corresponding error messages */
  if (moment(startTime).isBefore(moment())) {
    throwError(501, 'Booking Error', 'Cannot book time in the past')()
  }
  if (moment.duration(moment(startTime).diff(moment())).asHours() < 24) {
    throwError(
      501,
      'Booking Error',
      'Cannot book with less than 24 hours in advance'
    )()
  }
  if (!moment(startTime).isBetween(apptStartTime, apptEndTime, 'hours', '[]')) {
    throwError(501, 'Booking Error', 'Cannot book outside bookable timeframe')()
  }
  if (await isGivenTimeMatched()) {
    throwError(501, 'Booking Error', 'Invalid time slot')()
  }
  return true
}

/**
 * Check if requested time mataches with available time slots
 * @param {Date} dateTime
 * @returns {Boolean}
 */
const isGivenTimeMatched = async (dateTime) => {
  /* Modify given date to make comparison for 'isBetween'*/
  const startOfTheDay = getModifiedDate(dateTime, config.START_OF_DAY)
  const endOfTheDay = getModifiedDate(dateTime, config.END_OF_DAY)

  /* Get bookable timeslots */
  const availableTimeSlots = await getAvailableTimeSlots(
    startOfTheDay,
    endOfTheDay
  )

  if (!isEmpty(availableTimeSlots)) {
    /* Check if requested time is available */
    const isMatch = availableTimeSlots.some((ts) =>
      moment(ts.start).isSame(dateTime)
    )
    /* if time matches or true then send error-false i.e. no error */
    return isMatch ? false : true
  }
}

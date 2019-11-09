import moment from 'moment'
import { isUndefined, countBy } from 'loadsh'

import logger from 'common/logger'
import { getFilteredBookedAppoinments } from 'common/utils'
import { getBookedEvents, insertNewEvent } from 'services/googleApi'
import { isBookingTimeValid } from 'helpers/booking-validation'
import { checkWeekends } from 'helpers/date-time-validation'
import { getTotalTimeSlots } from 'helpers/generate-timeslots'
import { getAvailableTimeSlots } from 'helpers/timeslots-impl'

/**
 *
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {array}
 */
export const makeMonthlyTimeSlotsStatus = async (startDate, endDate) => {
  logger.info('Making time slots for each day for requested month', {
    startDate: startDate,
    endDate: endDate
  })

  const {
    data: { items }
  } = await getBookedEvents(startDate, endDate)

  const bookedEventsForEachDay = getBookedEventsForEachDay(items)

  return getTimeSlotStatus(bookedEventsForEachDay, startDate, endDate)
}

/**
 * Make available timeslots for given day, month and year
 * @param {Date} startTime
 * @param {Date} endTime
 * @returns {Array}
 */
export const makeTimeSlotsForGivenDay = async (startTime, endTime) => {
  logger.info('Making time slots for requested day', {
    startTime: startTime,
    endTime: endTime
  })

  checkWeekends(startTime, endTime)
  return await getAvailableTimeSlots(startTime, endTime)
}

/**
 * Book appointment time for requested time
 * @param {Date} startTime
 * @param {Date} endTime
 * @returns {Object}
 */
export const makeNewAppointment = async (startTime, endTime) => {
  logger.info('Booking time slots for requested day', {
    startTime: startTime,
    endTime: endTime
  })

  const bookingTimeValid = await isBookingTimeValid(startTime)

  /**
   * Book new appointment if requested date is
   * available and valid
   */
  if (bookingTimeValid) {
    let resource = {
      /* Set data for new appointment */
      summary: `Eight Appoinment`,
      location: `Location`,
      start: { dateTime: startTime },
      end: { dateTime: endTime },
      description: `Appointment Booked`
    }

    /* Call google calendar insert api */
    let insert = await insertNewEvent(resource)
    if (insert.status === 200) return { startTime: startTime, endTime: endTime }
  }
}

/**
 * Get no. of booked events for each daily on a monthly basis.
 * @param {Google Calender Events} items
 */
const getBookedEventsForEachDay = (items) => {
  const filteredBookedAppoinments = getFilteredBookedAppoinments(items)
  const bookedEventsForEachDay = filteredBookedAppoinments.map(
    (appointment, i) => moment(appointment.start.dateTime).date()
  )
  /* Count and return no of booked events for each day */
  return countBy(bookedEventsForEachDay)
}

/**
 * Get timeslot avaibility for each day of given MM and YYYY.
 * @param {array} bookedEventsForEachDay
 * @param {integer} totalNoOfDays
 * @returns {array}
 */
const getTimeSlotStatus = (bookedEventsForEachDay, startDate, endDate) => {
  const status = []
  const timeSlotsCount = getTotalTimeSlots()

  while (startDate <= endDate) {
    let i = moment(startDate).date()
    if (
      (bookedEventsForEachDay[i] < timeSlotsCount ||
        isUndefined(bookedEventsForEachDay[i])) &&
      (moment(startDate).weekday() !== 0 && moment(startDate).weekday() !== 6)
    ) {
      status.push({ day: i, hasTimeSlots: true })
    } else {
      status.push({ day: i, hasTimeSlots: false })
    }
    startDate.setDate(startDate.getDate() + 1)
  }
  return status
}

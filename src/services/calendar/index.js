import moment from 'moment'
import { isEqual, isUndefined, differenceWith, countBy } from 'loadsh'

import { getFilteredBookedAppoinments, formatToISO } from 'utils'
import { getBookedEvents, insertNewEvent } from 'services/googleApi'
import { getModifiedDate } from 'utils'
import {
  getTotalTimeSlots,
  generateTimeSlots
} from 'helpers/generate-timeslots'

/* Instantiate environment variable */
const config = process.env

/**
 *
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Array}
 */
export const makeMonthlyTimeSlotsStatus = async (startDate, endDate) => {
  const {
    data: { items }
  } = await getBookedEvents(startDate, endDate)

  const bookedEventsForEachDay = getBookedEventsForEachDay(items)

  const timeSlotsStatus = getTimeSlotStatus(
    bookedEventsForEachDay,
    startDate,
    endDate
  )
  return timeSlotsStatus
}

/**
 * Make available timeslots for given day, month and year
 * @param {Date} startTime
 * @param {Date} endTime
 * @returns {Array}
 */
export const makeTimeSlotsForGivenDay = async (startTime, endTime) => {
  return await getAvailableTimeSlots(startTime, endTime)
}

/**
 * Book appointment time for requested time
 * @param {Date} startTime
 * @param {Date} endTime
 * @returns {Object}
 */
export const makeNewAppointment = async (startTime, endTime) => {
  let message = ''
  let isBooked = false

  const apptStartTime = moment(config.START_TIME, config.TIME_FORMAT)
  const apptEndTime = moment(config.START_TIME, config.TIME_FORMAT)

  const isValidTimeSlot = isGivenTimeValid(startTime)

  /* check every given conditions and set corresponding error messages */
  if (moment(startTime).weekday() === 0 || moment(startTime).weekday() === 6) {
    message = 'Cannot book time during the weekends'
  } else if (moment(startTime).isBefore(moment())) {
    message = 'Cannot book time in the past'
  } else if (moment.duration(moment(startTime).diff(moment())).asHours() < 24) {
    message = 'Cannot book with less than 24 hours in advance'
  } else if (
    !moment(startTime).isBetween(apptStartTime, apptEndTime, 'hours', '[]')
  ) {
    message = 'Cannot book outside bookable timeframe'
  } else if (!isValidTimeSlot) {
    message = 'Invalid time slot'
  } else {
    /* Set data for new appointment */
    var resource = {
      summary: `Eight Appoinment`,
      location: `0/12 Prospect Road, Summer Hill, NSW 2130, Australia`,
      start: { dateTime: startTime },
      end: { dateTime: endTime },
      description: `Appointment Booked`
    }

    /* Call google calendar insert api */
    let insert = await insertNewEvent(resource)
    if (insert.status === 200) isBooked = true
  }

  return {
    status: isBooked ? true : false,
    result: isBooked ? availableTimeSlots : message
  }
}

/**
 * Get diff. btwn. Fixed Time Slots and Booked Appointments
 * and return array object
 * @param {Date} startTime
 * @param {Date} endTime
 * @returns {Array}
 */
const getAvailableTimeSlots = async (startTime, endTime) => {
  const {
    data: { items }
  } = await getBookedEvents(startTime, endTime)

  const bookedApps = getBookedAppointmentDateTime(items)
  const fixedTimeSlots = generateTimeSlots(startTime)
  const availableTimeSlots = differenceWith(fixedTimeSlots, bookedApps, isEqual)

  return availableTimeSlots
}

/**
 * Extract start and end time of booked appointments
 * and return them as an array object.
 * @param {*} items
 * @returns {Array}
 */
const getBookedAppointmentDateTime = (items) => {
  const filteredApps = getFilteredBookedAppoinments(items)
  return filteredApps.map(({ start, end }) => ({
    start: formatToISO(start.dateTime),
    end: formatToISO(end.dateTime)
  }))
}

/**
 * Get no. of booked events for each daily on a monthly basis.
 * @param {*} items
 */
const getBookedEventsForEachDay = (items) => {
  const filteredBookedAppoinments = getFilteredBookedAppoinments(items)
  const bookedEventsForEachDay = filteredBookedAppoinments.map(
    (appointment, i) => moment(appointment.start.dateTime).date()
  )
  // count no of booked events for each day
  const noOfBookedEvents = countBy(bookedEventsForEachDay)
  return noOfBookedEvents
}

/**
 * Get timeslot avaibility for each day of given MM and YYYY.
 * @param {*} bookedEventsForEachDay
 * @param {*} totalNoOfDays
 * @returns {Array}
 */
const getTimeSlotStatus = (bookedEventsForEachDay, startDate, endDate) => {
  const status = []
  const timeSlotsCount = getTotalTimeSlots()

  while (startDate <= endDate) {
    let i = moment(startDate).date()
    if (
      (bookedEventsForEachDay[i] < timeSlotsCount ||
        isUndefined(bookedEventsForEachDay[i])) &&
      (moment(startDate).weekday() !== 0 && // TODO: FIX it
        moment(startDate).weekday() !== 6)
    ) {
      status.push({ day: i, hasTimeSlots: true })
    } else {
      status.push({ day: i, hasTimeSlots: false })
    }
    startDate.setDate(startDate.getDate() + 1)
  }
  return status
}

/**
 * Check if requested time mataches with available
 * time slots
 * @param {Date} dateTime
 * @returns {Boolean}
 */
const isGivenTimeValid = async (dateTime) => {
  /* Modify given date to make comparison for 'isBetween'*/
  const startOfTheDay = getModifiedDate(dateTime, config.START_OF_DAY)
  const endOfTheDay = getModifiedDate(dateTime, config.END_OF_DAY)

  const availableTimeSlots = await getAvailableTimeSlots(
    startOfTheDay,
    endOfTheDay
  )

  /* Check if requested time is available */
  return availableTimeSlots.some((ts) => moment(ts.start).isSame(dateTime))
}

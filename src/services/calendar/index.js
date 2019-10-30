import moment from "moment"
import { isEqual, isUndefined, differenceWith, countBy } from "loadsh"

import { totalFixedTimeSlots, startTime, endTime } from "constants/common"
import {
  msgInvalidTime,
  msgPastTime,
  msgLessThan24hr,
  msgIsBetween
} from "constants/common"
import { getBookedEvents, insertNewEvent } from "services/googleApi"
import {
  getFilteredBookedAppoinments,
  getFixedISOTimeSolts,
  formatToISO,
  convertDateTimeToISOExplicitly
} from "utils"

export const makeMonthlyTimeSlotsStatus = async (startDate, endDate) => {
  const {
    data: { items }
  } = await getBookedEvents(startDate, endDate)
  const bookedEventsForEachDay = getBookedEventsForEachDay(items)
  const totalNoOfDays = endDate.getDate()
  const timeSlotsStatus = getTimeSlotStatus(
    bookedEventsForEachDay,
    totalNoOfDays
  )

  return timeSlotsStatus
}

export const makeTimeSlotsForGivenDay = async (startTime, endTime) => {
  const availableTimeSlots = await getAvailableTimeSlots(startTime, endTime)
  return availableTimeSlots
}

export const makeNewAppointment = async (
  startTime,
  endTime,
  requestedDateTime
) => {
  const availableTimeSlots = await getAvailableTimeSlots(startTime, endTime)
  const reqISODateTime = convertDateTimeToISOExplicitly(requestedDateTime)

  const check = validateRequestedDateTime(availableTimeSlots, reqISODateTime)

  // TODO: validateRequestedDateTime
  if(check.inValid)
    
  // const newEvent = await insertNewEvent()

  return isValidTimeSlot
}

// TODO:
const validateRequestedDateTime = (availableTimeSlots, reqISODateTime) => {
  let message

  // check if request booking time matches with available time slots
  const isValidTimeSlot = availableTimeSlots.some((slot) =>
    moment(slot.start).isSame(reqISODateTime)
  )

  if (reqDateTimeISO.isBefore(moment())) message = msgPastTime
  if (moment.duration(reqISODateTime.diff(moment())).asHours() < 24)
    message = msgLessThan24hr
  if (!reqDateTimeISO.isBetween(startTime, endTime, "hours", "[]"))
    message = msgIsBetween
  if (!isValidTimeSlot) message = msgInvalidTime

  return {message: message, isValid: false}
}

/**
 * Get diff. btwn. Fixed Time Slots and Booked Appointments
 * and return array object
 * @param {*} startTime
 * @param {*} endTime
 */
const getAvailableTimeSlots = async (startTime, endTime) => {
  const {
    data: { items }
  } = await getBookedEvents(startTime, endTime)
  const bookedApps = getBookedAppointmentDateTime(items)
  const fixedTimeSlots = getFixedISOTimeSolts(startTime)
  const availableTimeSlots = differenceWith(fixedTimeSlots, bookedApps, isEqual)
  return availableTimeSlots
}

/**
 * Extract start and end time of booked appointments
 * and return them as an array object.
 * @param {*} items
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
 * totalFixedTimeSlots (from ./utils) gives total no. of fixed
 * time slots.
 * @param {*} bookedEventsForEachDay
 * @param {*} totalNoOfDays
 */
const getTimeSlotStatus = (bookedEventsForEachDay, totalNoOfDays) => {
  const status = []
  for (let i = 1; i <= totalNoOfDays; i++) {
    if (
      bookedEventsForEachDay[i] < totalFixedTimeSlots ||
      isUndefined(bookedEventsForEachDay[i])
    )
      status.push({ day: i, hasTimeSlots: true })
    else status.push({ day: i, hasTimeSlots: false })
  }
  return status
}

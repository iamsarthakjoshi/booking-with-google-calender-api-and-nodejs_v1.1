import moment from "moment"
import { forEach, countBy } from "loadsh"

import { fixedTimeSlots } from "constants/common"

/**
 *  Get booked appointments
 * @param {*} items
 */
export const getFilteredBookedAppoinments = (items) => {
  const events = items.filter(
    (data) =>
      data.status === "confirmed" &&
      (new Date(data.start.dateTime).getUTCDay() !== 0 &&
        new Date(data.start.dateTime).getUTCDay() !== 6) &&
      (moment(data.start.dateTime)
        .utc()
        .hours() > 8 &&
        moment(data.start.dateTime)
          .utc()
          .hours() < 20)
  )
  return events
}

/**
 *
 * @param {*} dateOfAppointment
 */
export const getFixedISOTimeSolts = (dateOfAppointment) => {
  const date = formatFullDateTime(dateOfAppointment)
  forEach(fixedTimeSlots, (timeSlot, index) => {
    fixedTimeSlots[index].start = formatToISO(`${date}T${timeSlot.start}`)
    fixedTimeSlots[index].end = formatToISO(`${date}T${timeSlot.end}`)
  })
  return fixedTimeSlots
}

export const sanitizeDt = (dateTime) => {
  return (dateTime.toString().length < 2 ? "0" : "") + dateTime
}

export const getStartDate = (year, month, day) => {
  return new Date(year, month - 1, day)
}

export const getEndDate = (year, month, day) => {
  return new Date(year, month + 1, day)
}

export const convertDateTimeToISOExplicitly = (requestedDateTime) => {
  let {
    query: { year, month, day, hour, minute }
  } = requestedDateTime
  const fullDateTime = `${sanitizeDt(year)}-${sanitizeDt(month)}-${sanitizeDt(
    day
  )}T${sanitizeDt(hour)}:${sanitizeDt(minute)}:00.000Z`
  return fullDateTime
}

export const formatFullDateTime = (dateTime) =>
  moment(dateTime).format("YYYY-MM-DD")
export const formatToISO = (dateTime) => new Date(dateTime).toISOString()

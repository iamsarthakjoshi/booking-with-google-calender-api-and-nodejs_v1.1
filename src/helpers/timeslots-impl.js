import { isEqual, differenceWith } from 'loadsh'

import { getFilteredBookedAppoinments, formatToISO } from 'utils'
import { getBookedEvents } from 'services/googleApi'
import { generateTimeSlots } from 'helpers/generate-timeslots'

/**
 * Get diff. btwn. Fixed Time Slots and Booked Appointments
 * and return array object
 * @param {Date} startTime
 * @param {Date} endTime
 * @returns {Array}
 */
export const getAvailableTimeSlots = async (startTime, endTime) => {
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

import moment from 'moment'
import { forEach, countBy } from 'loadsh'

import { fixedTimeSlots } from 'constants/common'

/**
 *  Get booked appointments 
 * @param {*} items 
 */
export const getFilteredBookedAppoinments = (items) => {
  const events = items.filter(data => 
    data.status === 'confirmed' &&
    (new Date(data.start.dateTime).getUTCDay() !== 0 && 
    new Date(data.start.dateTime).getUTCDay() !== 6 )
    && (moment(data.start.dateTime).utc().hours() > 8 
    && moment(data.start.dateTime).utc().hours() < 20))
  return events
}

/**
 * 
 * @param {*} items 
 */
export const getBookedAppointmentDateTime = (items) => {
  const filteredApps = getFilteredBookedAppoinments(items)
  
  return filteredApps.map(({ start , end }) => ({
      start: formatToISO(start.dateTime), 
      end: formatToISO(end.dateTime)
    })
  )
}

/** 
  Get no. of booked events for each daily on a monthly basis
  @params
*/
export const getBookedEventsForEachDay = (items) => {
  const filteredBookedAppoinments = getFilteredBookedAppoinments(items)
  const bookedEventsForEachDay = filteredBookedAppoinments.map(
    (appointment,i)=> moment(appointment.start.dateTime).date()
    )
  return countBy(bookedEventsForEachDay)
}

/**
 * 
 * @param {*} dateOfAppointment 
 */
export const getFixedISOTimeSolts = (dateOfAppointment) => {
  const date = formatFullDateTime(dateOfAppointment)
  forEach(fixedTimeSlots, (timeSlot, index) => {
    fixedTimeSlots[index].start = formatToISO(`${date}T${timeSlot.start}`);
    fixedTimeSlots[index].end = formatToISO(`${date}T${timeSlot.end}`);
  })
  return fixedTimeSlots
}

const formatFullDateTime = (dateTime) => moment(dateTime).format('YYYY-MM-DD')
const formatToISO= (dateTime) => new Date(dateTime).toISOString();
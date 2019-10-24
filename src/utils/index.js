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

export const getFixedISOTimeSolts = (dateOfAppointment) => {
  const date = formatFullDateTime(dateOfAppointment)
  forEach(fixedTimeSlots, (timeSlot, index) => {
    fixedTimeSlots[index].startTime = `${date}T${timeSlot.startTime}`;
    fixedTimeSlots[index].endTime = `${date}T${timeSlot.endTime}`;
  })
  return fixedTimeSlots
}

const formatFullDateTime = (dateTime) => moment(dateTime).format('YYYY-MM-DD')
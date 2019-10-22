import moment from 'moment'
import { forEach } from 'loadsh'

import { getBookedEvents } from 'services/googleApi'
import { getFilteredBookedAppoinments } from 'utils'
import { timeslots } from 'constants/common'

export const getDaysTimeSlotStatus = async (token, startDate, endDate) => {

  const days = [];
  const totalNoOfDays = endDate.getDate();

  const { data: { items } } = await getBookedEvents(startDate, endDate)
  const filteredBookedAppoinements = getFilteredBookedAppoinments(items)

  for(let i = 1; i <= totalNoOfDays; i++) {
    let countAppointment = 0;
   
    forEach(filteredBookedAppoinements, appointment => {
      const dateOfAppointment = moment(appointment.start.dateTime).utc().format('YYYY-MM-DD')
      const startDateTime = appointment.start.dateTime

      if (i == new Date(startDateTime).getUTCDate()){ // check if dates match with filtered event's datetimes
          timeslots.forEach((d,c)=>{ // loop through given fixed timeslots
          if(moment(dateOfAppointment+d.start).isSame(startDateTime)){ // if fixed timeslots matches with filtered datetimes
            countAppointment++;
          }
        });
      }
    })

    if(countAppointment < 12)
      days.push({day: i, hasTimeSlots: true})
    else
      days.push({day: i, hasTimeSlots: false})
  }

  return days
}
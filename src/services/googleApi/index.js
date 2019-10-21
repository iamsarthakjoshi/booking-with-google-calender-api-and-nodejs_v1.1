import { google } from 'googleapis'
import moment from 'moment'
import { forEach } from 'loadsh'

import { timeslots } from 'constants/common'
import { getFilteredBookedAppoinments } from 'utils'

const oAuthClient = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID, 
  process.env.GOOGLE_CLIENT_SECRET, 
  process.env.GOOGLE_REDIRECT_URI
);

const calendar = google.calendar('v3')

const getBookedEvents = (startDate, endDate) => {
  return new Promise((resolve, reject) => {
    calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      maxResults: 30,
      timeMin: new Date(startDate).toISOString(),
      timeMax: new Date(endDate).toISOString(),
      auth: oAuthClient,
      singleEvents: true,
      orderBy: 'startTime'
    }, function(err, response) {
      if(err) reject(new Error('Error fetching booked events'))
      resolve(response)
    })
  })
}


export const getDaysTimeSlotStatus = async (token, startDate, endDate) => {
  oAuthClient.setCredentials(token);

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




import { google } from 'googleapis'

export const oAuthClient = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID, 
  process.env.GOOGLE_CLIENT_SECRET, 
  process.env.GOOGLE_REDIRECT_URI
);

const calendar = google.calendar('v3')

export const getBookedEvents = (startDate, endDate) => {
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

export const getAccessToken = (code) => {
  return new Promise((resolve, reject) => {
    oAuthClient.getToken(code, (err, token) => {
      if(err) reject(new Error('Error getting consent token'))
      resolve(token)
    })
  })
}

export const getOAuthClientUrl = () => {
  return oAuthClient.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/calendar'
  })
}

export const setOAuthCredentials = (token) => {
  oAuthClient.setCredentials(token);
}

//TODO: put this blocks to calender.js





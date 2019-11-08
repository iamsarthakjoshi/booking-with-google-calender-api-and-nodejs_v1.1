import { google } from 'googleapis'

const config = process.env
const calendar = google.calendar('v3')
const oAuthClient = getOAuthClient()

export const getBookedEvents = (startDate, endDate) => {
  return new Promise((resolve, reject) => {
    calendar.events.list(
      {
        calendarId: config.GOOGLE_CALENDAR_ID,
        maxResults: 30,
        timeMin: startDate,
        timeMax: endDate,
        auth: oAuthClient,
        singleEvents: true,
        orderBy: 'startTime'
      },
      (error, response) => {
        if (error) reject(new Error(error))
        resolve(response)
      }
    )
  })
}

export const insertNewEvent = (eventResource) => {
  console.log(`api: insert new event`)
  return new Promise((resolve, reject) => {
    calendar.events.insert(
      {
        calendarId: config.GOOGLE_CALENDAR_ID,
        auth: oAuthClient,
        resource: eventResource
      },
      (error, response) => {
        if (err) reject(new Error(error))
        resolve(response)
      }
    )
  })
}

function getOAuthClient() {
  return new google.auth.OAuth2(
    config.GOOGLE_CLIENT_ID,
    config.GOOGLE_CLIENT_SECRET,
    config.GOOGLE_REDIRECT_URI
  )
}

export const getAccessToken = (code) => {
  return new Promise((resolve, reject) => {
    oAuthClient.getToken(code, (err, token) => {
      if (err) reject(new Error('Error getting consent token'))
      resolve(token)
    })
  })
}

export const getOAuthClientUrl = () => {
  return oAuthClient.generateAuthUrl({
    access_type: 'offline',
    scope: config.GOOGLE_CALENDAR_SCOPE
  })
}

export const setOAuthCredentials = (token) => {
  oAuthClient.setCredentials(token)
}

import { google } from 'googleapis'

const config = process.env
const calendar = google.calendar('v3')
const oAuthClient = getOAuthClient()

/**
 * Request Google Cal. api to get list of events
 * @param {Date} startDate
 * @param {Date} endDate
 */
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

/**
 * Request Google Cal. api to insert an event
 * @param {Object} eventResource
 */
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

/* Return Google OAuth2 object  */
function getOAuthClient() {
  return new google.auth.OAuth2(
    config.GOOGLE_CLIENT_ID,
    config.GOOGLE_CLIENT_SECRET,
    config.GOOGLE_REDIRECT_URI
  )
}

/**
 * Request access token with code retrieved
 * from callback url
 * @param {string} code
 */
export const getAccessToken = (code) => {
  return new Promise((resolve, reject) => {
    oAuthClient.getToken(code, (err, token) => {
      if (err) reject(new Error('Error getting consent token'))
      resolve(token)
    })
  })
}

/**
 * Return OAuth Client URL
 */
export const getOAuthClientUrl = () => {
  return oAuthClient.generateAuthUrl({
    access_type: config.GOOGLE_TOKEN_ACCESS_TYPE,
    scope: config.GOOGLE_CALENDAR_SCOPE
  })
}

/**
 * Set OAuth Credentials with given token
 * @param {object} token
 */
export const setOAuthCredentials = (token) => {
  oAuthClient.setCredentials(token)
}

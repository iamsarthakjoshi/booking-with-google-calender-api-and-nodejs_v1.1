"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setOAuthCredentials = exports.getOAuthClientUrl = exports.getAccessToken = exports.insertNewEvent = exports.getBookedEvents = void 0;

var _googleapis = require("googleapis");

var config = process.env;

var calendar = _googleapis.google.calendar('v3');

var oAuthClient = getOAuthClient();
/**
 * Request Google Cal. api to get list of events
 * @param {Date} startDate
 * @param {Date} endDate
 */

var getBookedEvents = function getBookedEvents(startDate, endDate) {
  return new Promise(function (resolve, reject) {
    calendar.events.list({
      calendarId: config.GOOGLE_CALENDAR_ID,
      maxResults: 30,
      timeMin: startDate,
      timeMax: endDate,
      auth: oAuthClient,
      singleEvents: true,
      orderBy: 'startTime'
    }, function (error, response) {
      if (error) reject(new Error(error));
      resolve(response);
    });
  });
};
/**
 * Request Google Cal. api to insert an event
 * @param {Object} eventResource
 */


exports.getBookedEvents = getBookedEvents;

var insertNewEvent = function insertNewEvent(eventResource) {
  console.log("api: insert new event");
  return new Promise(function (resolve, reject) {
    calendar.events.insert({
      calendarId: config.GOOGLE_CALENDAR_ID,
      auth: oAuthClient,
      resource: eventResource
    }, function (error, response) {
      if (error) reject(new Error(error));
      resolve(response);
    });
  });
};
/* Return Google OAuth2 object  */


exports.insertNewEvent = insertNewEvent;

function getOAuthClient() {
  return new _googleapis.google.auth.OAuth2(config.GOOGLE_CLIENT_ID, config.GOOGLE_CLIENT_SECRET, config.GOOGLE_REDIRECT_URI + config.GOOGLE_REDIRECT_END_POINT);
}
/**
 * Request access token with code retrieved
 * from callback url
 * @param {string} code
 */


var getAccessToken = function getAccessToken(code) {
  return new Promise(function (resolve, reject) {
    oAuthClient.getToken(code, function (err, token) {
      if (err) reject(new Error('Error getting consent token'));
      resolve(token);
    });
  });
};
/**
 * Return OAuth Client URL
 */


exports.getAccessToken = getAccessToken;

var getOAuthClientUrl = function getOAuthClientUrl() {
  return oAuthClient.generateAuthUrl({
    access_type: config.GOOGLE_TOKEN_ACCESS_TYPE,
    scope: config.GOOGLE_CALENDAR_SCOPE
  });
};
/**
 * Set OAuth Credentials with given token
 * @param {object} token
 */


exports.getOAuthClientUrl = getOAuthClientUrl;

var setOAuthCredentials = function setOAuthCredentials(token) {
  oAuthClient.setCredentials(token);
};

exports.setOAuthCredentials = setOAuthCredentials;
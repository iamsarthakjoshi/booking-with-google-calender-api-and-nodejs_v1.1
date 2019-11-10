"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFormattedDate = exports.getModifiedDate = exports.formatToISO = exports.getEndDateTime = exports.getDateTime = exports.getEndDate = exports.getStartDate = exports.getFilteredBookedAppoinments = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _dateTimeValidation = require("../../helpers/date-time-validation");

var getFilteredBookedAppoinments = function getFilteredBookedAppoinments(items) {
  return items.filter(function (data) {
    return data.status === 'confirmed' && (0, _moment["default"])(data.start.dateTime).weekday() !== 0 && (0, _moment["default"])(data.start.dateTime).weekday() !== 6 && (0, _moment["default"])(data.start.dateTime).hours() >= 9 && (0, _moment["default"])(data.start.dateTime).hours() <= 18;
  });
};
/* Return appointment initial ISO date */


exports.getFilteredBookedAppoinments = getFilteredBookedAppoinments;

var getStartDate = function getStartDate(year, month, day) {
  (0, _dateTimeValidation.validateDateTime)(month, day);
  return new Date(year, month - 1, day);
};
/* Return appointment final ISO date */


exports.getStartDate = getStartDate;

var getEndDate = function getEndDate(year, month, day) {
  (0, _dateTimeValidation.validateDateTime)(month, day);
  return new Date(year, month, day);
};
/* Return ISO date-time */


exports.getEndDate = getEndDate;

var getDateTime = function getDateTime(year, month, day, hour, minute) {
  (0, _dateTimeValidation.validateDateTime)(month, day, hour, minute);
  return new Date(year, month - 1, day, hour, minute);
};
/* Return ISO date-time with additional 40 minutes */


exports.getDateTime = getDateTime;

var getEndDateTime = function getEndDateTime(year, month, day, hour, minute) {
  (0, _dateTimeValidation.validateDateTime)(month, day, hour, minute);
  var appointmentDuration = parseInt(process.env.APPOINTMENT_DURATION);
  var tempDate = new Date(year, month - 1, day, hour, minute);
  /* Add 40 mins duration */

  tempDate.setMinutes(tempDate.getMinutes() + appointmentDuration);
  return tempDate;
};
/**
 * Re-Format iso date-time to ISO 8601
 * @param {Date} dateTime
 */


exports.getEndDateTime = getEndDateTime;

var formatToISO = function formatToISO(dateTime) {
  return new Date(dateTime);
};
/**
 * Modifiy given date with provided time string
 * @param {Date} dateTime
 * @param {string} timeString
 * @returns {moment}
 */


exports.formatToISO = formatToISO;

var getModifiedDate = function getModifiedDate(dateTime, timeString) {
  var config = process.env;
  var time = (0, _moment["default"])(timeString, config.TIME_FORMAT);
  return (0, _moment["default"])(dateTime).set({
    hour: time.get('hour'),
    minute: time.get('minute'),
    second: time.get('second')
  }).toDate();
};
/**
 * Return date in YYYY-MM-DD format
 * @param {Date} date
 */


exports.getModifiedDate = getModifiedDate;

var getFormattedDate = function getFormattedDate(date) {
  return (0, _moment["default"])(date).format('YYYY-MM-DD');
};

exports.getFormattedDate = getFormattedDate;
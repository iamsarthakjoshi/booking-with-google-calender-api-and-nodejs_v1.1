"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateDateTime = exports.isWeekends = exports.validatePastDateTime = exports.validateWeekends = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _errorHandler = require("../handler/error-handler");

var validateWeekends = function validateWeekends(dateTime) {
  if (isWeekends(dateTime)) (0, _errorHandler.throwError)(501, 'DateTime Error', 'Appointments can only be booked during weekdays')();
};
/**
 * Check if given date falls on past date and time
 * and throw error if it does
 * @param {Date} dateTime
 */


exports.validateWeekends = validateWeekends;

var validatePastDateTime = function validatePastDateTime(dateTime) {
  console.log((0, _moment["default"])(dateTime).toDate(), (0, _moment["default"])().toDate());

  if ((0, _moment["default"])(dateTime).isBefore((0, _moment["default"])())) {
    (0, _errorHandler.throwError)(501, 'DateTime Error', 'No time slots available for past')();
  }
};
/**
 * Return true if given date falls on weekends
 * @param {Date} dateTime
 */


exports.validatePastDateTime = validatePastDateTime;

var isWeekends = function isWeekends(dateTime) {
  return (0, _moment["default"])(dateTime).weekday() === 0 || (0, _moment["default"])(dateTime).weekday() === 6;
};
/**
 * Sanitize month, day, hour and minute
 * @param {*} month
 * @param {*} day
 * @param {*} hour
 * @param {*} minute
 */


exports.isWeekends = isWeekends;

var validateDateTime = function validateDateTime(month, day, hour, minute) {
  if (month !== undefined && month > 12) (0, _errorHandler.throwError)(501, 'DateTime Error', 'Month can only be less than or up to 12 and greater than 0')();
  if (day !== undefined && day > 31) (0, _errorHandler.throwError)(501, 'DateTime Error', 'Month can only be less than or up to 31 and greater than 0')();
  if (hour !== undefined && hour > 24) (0, _errorHandler.throwError)(501, 'DateTime Error', 'Hour can only be less than or up to 24 and greater than 0')();
  if (minute !== undefined && minute > 59) (0, _errorHandler.throwError)(501, 'DateTime Error', 'Minute can only be less than or up to 59 and greater than 0')();
};

exports.validateDateTime = validateDateTime;
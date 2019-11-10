"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTotalTimeSlots = exports.generateTimeSlots = void 0;

var _moment = _interopRequireDefault(require("moment"));

var config = process.env;
var appointmentDuration = config.APPOINTMENT_DURATION;
var appointmentInterval = config.APPOINTMENT_INTERVAL;
/**
 * Dynamically generate desired time slots
 * @param {Date} date
 * @returns {Array}
 */

var generateTimeSlots = function generateTimeSlots(date) {
  var timeSlots = [];
  var startTime = (0, _moment["default"])(config.START_TIME, config.TIME_FORMAT);
  var endTime = (0, _moment["default"])(config.END_TIME, config.TIME_FORMAT);
  var startDateTime = (0, _moment["default"])(date).set({
    hour: startTime.get('hour'),
    minute: startTime.get('minute'),
    second: startTime.get('second')
  });
  var endDateTime = (0, _moment["default"])(date).set({
    hour: endTime.get('hour'),
    minute: endTime.get('minute'),
    second: endTime.get('second')
  });

  while (startDateTime < endDateTime) {
    timeSlots.push({
      start: startDateTime.toDate(),
      end: startDateTime.add(appointmentDuration, 'minutes').toDate()
    });
    startDateTime.add(appointmentInterval, 'minutes');
  }

  return timeSlots;
};
/**
 * Count total number of bookable time slots
 * @returns {Int16Array}
 */


exports.generateTimeSlots = generateTimeSlots;

var getTotalTimeSlots = function getTotalTimeSlots() {
  var count = 0;
  var startTime = (0, _moment["default"])(config.START_TIME, config.TIME_FORMAT);
  var endTime = (0, _moment["default"])(config.END_TIME, config.TIME_FORMAT);

  while (startTime < endTime) {
    startTime.add(appointmentDuration, 'minutes');
    startTime.add(appointmentInterval, 'minutes');
    count++;
  }

  return count;
};

exports.getTotalTimeSlots = getTotalTimeSlots;
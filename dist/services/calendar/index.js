"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeNewAppointment = exports.makeTimeSlotsForGivenDay = exports.makeMonthlyTimeSlotsStatus = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _moment = _interopRequireDefault(require("moment"));

var _loadsh = require("loadsh");

var _logger = _interopRequireDefault(require("../../common/logger"));

var _utils = require("../../common/utils");

var _googleApi = require("../googleApi");

var _bookingValidation = require("../../helpers/booking-validation");

var _dateTimeValidation = require("../../helpers/date-time-validation");

var _generateTimeslots = require("../../helpers/generate-timeslots");

var _timeslotsImpl = require("../../helpers/timeslots-impl");

var makeMonthlyTimeSlotsStatus =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(startDate, endDate) {
    var _ref2, items, bookedEventsForEachDay;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _logger["default"].info('Making time slots for each day for requested month', {
              startDate: startDate,
              endDate: endDate
            });

            _context.next = 3;
            return (0, _googleApi.getBookedEvents)(startDate, endDate);

          case 3:
            _ref2 = _context.sent;
            items = _ref2.data.items;
            bookedEventsForEachDay = getBookedEventsForEachDay(items);
            /* Check if requested date time fall on Past date time */

            (0, _dateTimeValidation.validatePastDateTime)(endDate);
            return _context.abrupt("return", getTimeSlotStatus(bookedEventsForEachDay, startDate, endDate));

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function makeMonthlyTimeSlotsStatus(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Make available timeslots for given day, month and year
 * @param {Date} startTime
 * @param {Date} endTime
 * @returns {Array}
 */


exports.makeMonthlyTimeSlotsStatus = makeMonthlyTimeSlotsStatus;

var makeTimeSlotsForGivenDay =
/*#__PURE__*/
function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(startTime, endTime) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _logger["default"].info('Making time slots for requested day', {
              startTime: startTime,
              endTime: endTime
            });
            /* Check if requested date time fall on Past date time */


            (0, _dateTimeValidation.validatePastDateTime)(startTime);
            /* Check if requested date time fall on weekends */

            (0, _dateTimeValidation.validateWeekends)(startTime);
            _context2.next = 5;
            return (0, _timeslotsImpl.getAvailableTimeSlots)(startTime, endTime);

          case 5:
            return _context2.abrupt("return", _context2.sent);

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function makeTimeSlotsForGivenDay(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * Book appointment time for requested time
 * @param {Date} startTime
 * @param {Date} endTime
 * @returns {Object}
 */


exports.makeTimeSlotsForGivenDay = makeTimeSlotsForGivenDay;

var makeNewAppointment =
/*#__PURE__*/
function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3(startTime, endTime) {
    var bookingTimeValid, resource, insert;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _logger["default"].info('Booking time slots for requested day', {
              startTime: startTime,
              endTime: endTime
            });

            _context3.next = 3;
            return (0, _bookingValidation.isBookingTimeValid)(startTime);

          case 3:
            bookingTimeValid = _context3.sent;

            if (!bookingTimeValid) {
              _context3.next = 11;
              break;
            }

            resource = {
              /* Set data for new appointment */
              summary: "Eight Appoinment",
              location: "Location",
              start: {
                dateTime: startTime
              },
              end: {
                dateTime: endTime
              },
              description: "Appointment Booked"
            };
            /* Call google calendar insert api */

            _context3.next = 8;
            return (0, _googleApi.insertNewEvent)(resource);

          case 8:
            insert = _context3.sent;

            if (!(insert.status === 200)) {
              _context3.next = 11;
              break;
            }

            return _context3.abrupt("return", {
              startTime: startTime,
              endTime: endTime
            });

          case 11:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function makeNewAppointment(_x5, _x6) {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * Get no. of booked events for each daily on a monthly basis.
 * @param {Google Calender Events} items
 */


exports.makeNewAppointment = makeNewAppointment;

var getBookedEventsForEachDay = function getBookedEventsForEachDay(items) {
  var filteredBookedAppoinments = (0, _utils.getFilteredBookedAppoinments)(items);
  var bookedEventsForEachDay = filteredBookedAppoinments.map(function (appointment, i) {
    return (0, _moment["default"])(appointment.start.dateTime).date();
  });
  /* Count and return no of booked events for each day */

  return (0, _loadsh.countBy)(bookedEventsForEachDay);
};
/**
 * Get timeslot avaibility for each day of given MM and YYYY.
 * @param {array} bookedEventsForEachDay
 * @param {integer} totalNoOfDays
 * @returns {array}
 */


var getTimeSlotStatus = function getTimeSlotStatus(bookedEventsForEachDay, startDate, endDate) {
  var status = [];
  var timeSlotsCount = (0, _generateTimeslots.getTotalTimeSlots)();

  while (startDate <= endDate) {
    var i = (0, _moment["default"])(startDate).date();

    if ((bookedEventsForEachDay[i] < timeSlotsCount || (0, _loadsh.isUndefined)(bookedEventsForEachDay[i])) && (0, _moment["default"])(startDate).weekday() !== 0 && (0, _moment["default"])(startDate).weekday() !== 6) {
      status.push({
        day: i,
        hasTimeSlots: true
      });
    } else {
      status.push({
        day: i,
        hasTimeSlots: false
      });
    }

    startDate.setDate(startDate.getDate() + 1);
  }

  return status;
};
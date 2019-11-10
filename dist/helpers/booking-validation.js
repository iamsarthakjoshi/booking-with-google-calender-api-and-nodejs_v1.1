"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isBookingTimeValid = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _moment = _interopRequireDefault(require("moment"));

var _loadsh = require("loadsh");

var _utils = require("../common/utils");

var _errorHandler = require("../handler/error-handler");

var _timeslotsImpl = require("./timeslots-impl");

var config = process.env;
/**
 * Check if requested booking time statisfy our terms and conditions
 * @param {Date} appointmentBookingTime
 */

var isBookingTimeValid =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(appointmentBookingTime) {
    var startTime, apptStartTime, apptEndTime;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            startTime = appointmentBookingTime;
            apptStartTime = (0, _utils.getModifiedDate)(startTime, config.START_TIME);
            apptEndTime = (0, _utils.getModifiedDate)(startTime, config.END_TIME);
            /* check every given conditions and set corresponding error messages */

            if ((0, _moment["default"])(startTime).isBefore((0, _moment["default"])())) {
              (0, _errorHandler.throwError)(501, 'Booking Error', 'Cannot book time in the past')();
            }

            if (_moment["default"].duration((0, _moment["default"])(startTime).diff((0, _moment["default"])())).asHours() < 24) {
              (0, _errorHandler.throwError)(501, 'Booking Error', 'Cannot book with less than 24 hours in advance')();
            }

            if (!(0, _moment["default"])(startTime).isBetween(apptStartTime, apptEndTime, 'hours', '[]')) {
              (0, _errorHandler.throwError)(501, 'Booking Error', 'Cannot book outside bookable timeframe')();
            }

            _context.next = 8;
            return isGivenTimeMatched();

          case 8:
            if (!_context.sent) {
              _context.next = 10;
              break;
            }

            (0, _errorHandler.throwError)(501, 'Booking Error', 'Invalid time slot')();

          case 10:
            return _context.abrupt("return", true);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function isBookingTimeValid(_x) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Check if requested time mataches with available time slots
 * @param {Date} dateTime
 * @returns {Boolean}
 */


exports.isBookingTimeValid = isBookingTimeValid;

var isGivenTimeMatched =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(dateTime) {
    var startOfTheDay, endOfTheDay, availableTimeSlots, isMatch;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            /* Modify given date to make comparison for 'isBetween'*/
            startOfTheDay = (0, _utils.getModifiedDate)(dateTime, config.START_OF_DAY);
            endOfTheDay = (0, _utils.getModifiedDate)(dateTime, config.END_OF_DAY);
            /* Get bookable timeslots */

            _context2.next = 4;
            return (0, _timeslotsImpl.getAvailableTimeSlots)(startOfTheDay, endOfTheDay);

          case 4:
            availableTimeSlots = _context2.sent;

            if ((0, _loadsh.isEmpty)(availableTimeSlots)) {
              _context2.next = 8;
              break;
            }

            /* Check if requested time is available */
            isMatch = availableTimeSlots.some(function (ts) {
              return (0, _moment["default"])(ts.start).isSame(dateTime);
            });
            /* if time matches or true then send error-false i.e. no error */

            return _context2.abrupt("return", isMatch ? false : true);

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function isGivenTimeMatched(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
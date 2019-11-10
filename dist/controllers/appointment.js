"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bookNewAppointment = exports.getTimeSlotsForGivenDay = exports.getMonthlyTimeSlotsStatus = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _loadsh = require("loadsh");

var _responseHandler = require("../handler/response-handler");

var _utils = require("../common/utils");

var _calendar = require("../services/calendar");

var getMonthlyTimeSlotsStatus =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(req, res) {
    var _req$query, year, month, startDate, endDate, days;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _req$query = req.query, year = _req$query.year, month = _req$query.month;
            /* Year and month requested by the user */

            startDate = (0, _utils.getStartDate)(year, month, 1);
            endDate = (0, _utils.getEndDate)(year, month, 0);
            _context.next = 6;
            return (0, _calendar.makeMonthlyTimeSlotsStatus)(startDate, endDate);

          case 6:
            days = _context.sent;
            //logger.info('Timeslots status for each day are fetched!')
            (0, _responseHandler.sendSuccess)(res, 'days')({
              days: days
            });
            _context.next = 13;
            break;

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](0);
            //logger.error(error.message, { stacktrace: error.stack })
            (0, _responseHandler.sendError)(res, _context.t0.code, _context.t0.message)();

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 10]]);
  }));

  return function getMonthlyTimeSlotsStatus(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Get TimeSlots for given day and send corresponding response
 * @param {Resquest} req
 * @param {Response} res
 */


exports.getMonthlyTimeSlotsStatus = getMonthlyTimeSlotsStatus;

var getTimeSlotsForGivenDay =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(req, res) {
    var _req$query2, year, month, day, startTime, endTime, timeSlots;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _req$query2 = req.query, year = _req$query2.year, month = _req$query2.month, day = _req$query2.day;
            /* date-time requested by the user */

            /* Set time between every hours in 24 hour */

            startTime = (0, _utils.getDateTime)(year, month, day, 0, 0);
            endTime = (0, _utils.getDateTime)(year, month, day, 23, 59);
            _context2.next = 6;
            return (0, _calendar.makeTimeSlotsForGivenDay)(startTime, endTime);

          case 6:
            timeSlots = _context2.sent;
            //logger.info('Timeslots are fetched!')
            (0, _responseHandler.sendSuccess)(res, 'timeSlots')((0, _loadsh.isEmpty)(timeSlots) ? {
              timeSlots: timeSlots,
              message: 'No time slots available at the moment'
            } : {
              timeSlots: timeSlots
            });
            _context2.next = 13;
            break;

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2["catch"](0);
            //logger.error(error.message, { stacktrace: error.stack })
            (0, _responseHandler.sendError)(res, _context2.t0.code, _context2.t0.message)();

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 10]]);
  }));

  return function getTimeSlotsForGivenDay(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * Book new appointment time for requested date-time
 * and send corresponding reponse
 * @param {Resquest} req
 * @param {Response} res
 */


exports.getTimeSlotsForGivenDay = getTimeSlotsForGivenDay;

var bookNewAppointment =
/*#__PURE__*/
function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3(req, res) {
    var _req$query3, year, month, day, hour, minute, startTime, endTime, bookedTimeSlot;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _req$query3 = req.query, year = _req$query3.year, month = _req$query3.month, day = _req$query3.day, hour = _req$query3.hour, minute = _req$query3.minute;
            /* Booking date-time requested by the user */

            startTime = (0, _utils.getDateTime)(year, month, day, hour, minute);
            endTime = (0, _utils.getEndDateTime)(year, month, day, hour, minute);
            _context3.next = 6;
            return (0, _calendar.makeNewAppointment)(startTime, endTime);

          case 6:
            bookedTimeSlot = _context3.sent;
            //logger.info('Appointment booked!', bookedTimeSlot)
            (0, _responseHandler.sendSuccess)(res, 'booking')(bookedTimeSlot);
            _context3.next = 13;
            break;

          case 10:
            _context3.prev = 10;
            _context3.t0 = _context3["catch"](0);
            //logger.error(error.message, { stacktrace: error.stack })
            (0, _responseHandler.sendError)(res, _context3.t0.code, _context3.t0.message)();

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 10]]);
  }));

  return function bookNewAppointment(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

exports.bookNewAppointment = bookNewAppointment;
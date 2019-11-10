"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAvailableTimeSlots = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _loadsh = require("loadsh");

var _utils = require("../common/utils");

var _googleApi = require("../services/googleApi");

var _generateTimeslots = require("./generate-timeslots");

var getAvailableTimeSlots =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(startTime, endTime) {
    var _ref2, items, bookedApps, fixedTimeSlots, availableTimeSlots;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _googleApi.getBookedEvents)(startTime, endTime);

          case 2:
            _ref2 = _context.sent;
            items = _ref2.data.items;
            bookedApps = getBookedAppointmentDateTime(items);
            fixedTimeSlots = (0, _generateTimeslots.generateTimeSlots)(startTime);
            availableTimeSlots = (0, _loadsh.differenceWith)(fixedTimeSlots, bookedApps, _loadsh.isEqual);
            return _context.abrupt("return", availableTimeSlots);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getAvailableTimeSlots(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Extract start and end time of booked appointments
 * and return them as an array object.
 * @param {*} items
 * @returns {Array}
 */


exports.getAvailableTimeSlots = getAvailableTimeSlots;

var getBookedAppointmentDateTime = function getBookedAppointmentDateTime(items) {
  var filteredApps = (0, _utils.getFilteredBookedAppoinments)(items);
  return filteredApps.map(function (_ref3) {
    var start = _ref3.start,
        end = _ref3.end;
    return {
      start: (0, _utils.formatToISO)(start.dateTime),
      end: (0, _utils.formatToISO)(end.dateTime)
    };
  });
};
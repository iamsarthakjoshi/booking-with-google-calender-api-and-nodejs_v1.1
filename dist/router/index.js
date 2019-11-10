"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _checkLogin = require("../middlewares/checkLogin");

var _checkQueryParams = require("../middlewares/checkQueryParams");

var _redirectOAuthCallbacks = require("../middlewares/redirectOAuthCallbacks");

var _appointment = require("../controllers/appointment");

var router = _express["default"].Router();

router.get('/days', _checkLogin.checkLogin, _checkQueryParams.checkQueryParams, _appointment.getMonthlyTimeSlotsStatus);
router.get('/timeslots', _checkLogin.checkLogin, _checkQueryParams.checkQueryParams, _appointment.getTimeSlotsForGivenDay);
router.get('/book', _checkLogin.checkLogin, _checkQueryParams.checkQueryParams, _appointment.bookNewAppointment);
router.get('/oauth/callback', _redirectOAuthCallbacks.handleCallBacks);
module.exports = router;
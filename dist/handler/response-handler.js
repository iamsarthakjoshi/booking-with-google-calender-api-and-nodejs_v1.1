"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendError = exports.sendSuccess = void 0;

/**
 * Send response with status:200, success value and
 * success message for each type of request
 * @param {Response} res
 * @param {Request Type} reqType
 */
var sendSuccess = function sendSuccess(res, reqType) {
  return function (data) {
    var timeSlots = data.timeSlots,
        message = data.message,
        startTime = data.startTime,
        endTime = data.endTime;
    if (reqType === 'timeSlots') res.status(200).json({
      success: true,
      timeSlots: timeSlots,
      message: message
    });else if (reqType === 'booking') res.status(200).json({
      success: true,
      startTime: startTime,
      endTime: endTime
    });else res.status(200).json({
      success: true,
      data: data
    });
  };
};
/**
 * Send response with either 501 status code or user defined
 * error code with success value and failed message
 * @param {Response} res
 * @param {Error Code} statusCode
 * @param {Error Message} message
 */


exports.sendSuccess = sendSuccess;

var sendError = function sendError(res, statusCode, message) {
  return function (error) {
    res.status(statusCode || 501).json({
      success: false,
      message: message || error.message,
      error: error
    });
  };
};

exports.sendError = sendError;
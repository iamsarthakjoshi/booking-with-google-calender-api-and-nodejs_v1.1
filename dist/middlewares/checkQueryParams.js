"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkQueryParams = void 0;

var _loadsh = require("loadsh");

var _responseHandler = require("../handler/response-handler");

var checkQueryParams = function checkQueryParams(req, res, next) {
  //logger.info('Checking Query Parameters')
  var queryKeyStrings = [];
  /* Check request path and assign query's keys to variable */

  if (req.path === '/days') queryKeyStrings = ['year', 'month'];else queryKeyStrings = ['year', 'month', 'day'];
  /* check if any missing params */

  var allMissingParams = getMissingParams(queryKeyStrings, req.query);

  if (!(0, _loadsh.isEmpty)(allMissingParams)) {
    //logger.error(`Request is missing parameter: ${allMissingParams}`)
    (0, _responseHandler.sendError)(res, 501, "Request is missing parameter: ".concat(allMissingParams))();
    return;
  }

  next();
};
/**
 * Get string of concatinated missing params with comma separator
 * @param {String} queryKeyStrings
 * @param {Request} req
 */


exports.checkQueryParams = checkQueryParams;

var getMissingParams = function getMissingParams(queryKeyStrings, reqQuery) {
  var tempParams = '';
  /* prevent undefined with '' */

  var queryKeys = (0, _loadsh.keys)(reqQuery);
  /* Extract array of keys from req's query */

  /* Get missing params by comparing queryKeys with queryKeyStrings */

  var missingParams = (0, _loadsh.differenceWith)(queryKeyStrings, queryKeys, _loadsh.isEqual);
  /* Map through missingParams arr and concat them with comma "," */

  missingParams.map(function (d, i) {
    tempParams += "".concat(i > 0 ? ', ' : '').concat(d);
  });
  return tempParams;
};
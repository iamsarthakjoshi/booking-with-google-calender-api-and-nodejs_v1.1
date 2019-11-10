"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOriginalRequestedUrl = exports.checkLogin = void 0;

var _logger = _interopRequireDefault(require("../common/logger"));

var _googleApi = require("../services/googleApi");

var originalRequestedUrl;
/**
 * Middleware that checks cookie and token expiry
 * @param {Request} req
 * @param {Reponse} res
 * @param {next} next
 */

var checkLogin = function checkLogin(req, res, next) {
  _logger["default"].info('Authenticating User Token');

  var cookieGoogleAccessToken = req.cookies.cookieGoogleAccessToken,
      originalUrl = req.originalUrl;
  originalRequestedUrl = originalUrl;
  var token = cookieGoogleAccessToken;
  /**
   * Check cookie containing tooken, Also
   * if Token is expired if cookie exist
   */

  if (!token || token && isTokenExpired(token)) {
    _logger["default"].warn('Cookie Token Not Found || Token Expired');

    res.redirect((0, _googleApi.getOAuthClientUrl)());
    return;
  }

  (0, _googleApi.setOAuthCredentials)(token);
  next();
};

exports.checkLogin = checkLogin;

var isTokenExpired = function isTokenExpired(token) {
  return new Date(token.expiry_date) < new Date();
};

var getOriginalRequestedUrl = function getOriginalRequestedUrl() {
  return originalRequestedUrl;
};

exports.getOriginalRequestedUrl = getOriginalRequestedUrl;
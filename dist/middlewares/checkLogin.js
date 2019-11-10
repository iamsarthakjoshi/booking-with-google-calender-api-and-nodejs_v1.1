"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOriginalRequestedUrl = exports.checkLogin = void 0;

var _googleApi = require("../services/googleApi");

//import logger from 'common/logger'
var originalRequestedUrl;
/**
 * Middleware that checks cookie and token expiry
 * @param {Request} req
 * @param {Reponse} res
 * @param {next} next
 */

var checkLogin = function checkLogin(req, res, next) {
  //logger.info('Authenticating User Token')
  var cookieGoogleAccessToken = req.cookies.cookieGoogleAccessToken,
      originalUrl = req.originalUrl;
  originalRequestedUrl = originalUrl;
  var token = cookieGoogleAccessToken;
  /**
   * Check cookie containing tooken, Also
   * if Token is expired if cookie exist
   */

  if (!token || token && isTokenExpired(token)) {
    //logger.warn('Cookie Token Not Found || Token Expired', {isTokenExpired: isTokenExpired(token)})
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
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.throwIf = exports.throwError = void 0;

/**
 * Throw new Error with error status code, type and message
 * @param {Error Code} code
 * @param {Error Type} errorType
 * @param {Error Message} errorMessage
 */
var throwError = function throwError(code, errorType, errorMessage) {
  return function (error) {
    if (!error) error = new Error(errorMessage || 'Error Occured');
    error.code = code;
    error.errorType = errorType;
    throw error;
  };
};
/**
 * Receive function to determine and call throwError()
 * @param {Function} fn
 * @param {Error Code} code
 * @param {Error Type} errorType
 * @param {Error Message} errorMessage
 */


exports.throwError = throwError;

var throwIf = function throwIf(fn, code, errorType, errorMessage) {
  return function (result) {
    if (fn(result)) {
      return throwError(code, errorType, errorMessage)();
    }

    return result;
  };
};

exports.throwIf = throwIf;
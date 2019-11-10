"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _winston = require("winston");

var combine = _winston.format.combine,
    timestamp = _winston.format.timestamp,
    printf = _winston.format.printf,
    prettyPrint = _winston.format.prettyPrint,
    json = _winston.format.json,
    colorize = _winston.format.colorize;
/* Declare custom log levels and corresponding colors */

var customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 4
  },
  colors: {
    error: 'red',
    info: 'cyan',
    warn: 'yellow',
    debug: 'purple'
  }
};
/* Assign application environment */

var isProduction = process.env.NODE_ENV === 'production';
/**
 * Custom Logger using Wiston Logger Package
 */

var Logger =
/*#__PURE__*/
function () {
  function Logger() {
    (0, _classCallCheck2["default"])(this, Logger);
    var fileTransport = new _winston.transports.File({
      maxFiles: 5,
      maxsize: 5120000,
      filename: "".concat(__dirname, "/../logs/logs.log"),
      level: 'warn'
      /* logs error and warn  */
      ,
      format: json()
    });
    var consoleTransport = new _winston.transports.Console({
      level: 'info'
      /* displays all levels of logs */

    });
    this.logger = (0, _winston.createLogger)({
      format: mainLogFormat,
      level: isProduction ? 'info' : 'debug',
      levels: customLevels.levels,
      transports: [fileTransport, consoleTransport]
    });
    (0, _winston.addColors)(customLevels.colors);
  }

  (0, _createClass2["default"])(Logger, [{
    key: "debug",
    value: function debug(msg, meta) {
      this.logger.debug(msg, meta);
    }
  }, {
    key: "info",
    value: function info(msg, meta) {
      this.logger.info(msg, meta);
    }
  }, {
    key: "error",
    value: function error(msg, meta) {
      this.logger.error(msg, meta);
    }
  }, {
    key: "warn",
    value: function warn(msg, meta) {
      this.logger.warn(msg, meta);
    }
  }]);
  return Logger;
}();
/* Parse incoming log data */


var parser = function parser(data) {
  if (!data) {
    return '';
  }

  if (typeof data === 'string') {
    return data;
  }

  return Object.keys(data).length ? JSON.stringify(data) : '';
};
/* Log format for Console and File Logs */


var mainLogFormat = combine(colorize(), timestamp({
  format: 'YYYY-MM-DD HH:mm:ss:A'
}), prettyPrint(), printf(function (info) {
  var timestamp = info.timestamp,
      level = info.level,
      message = info.message,
      meta = (0, _objectWithoutProperties2["default"])(info, ["timestamp", "level", "message"]);
  var metaMsg = meta ? " ".concat(parser(meta)) : '';
  return "[".concat(timestamp, "] [").concat(level, "] ").concat(parser(message), " ").concat(metaMsg);
}));
module.exports = new Logger();
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _router = _interopRequireDefault(require("./router"));

//import logger from 'common/logger'
var app = (0, _express["default"])();
var PORT = process.env.PORT;
app.use(_bodyParser["default"].json());
app.use((0, _cookieParser["default"])());
app.use('/', _router["default"]);
/* Handle 404 errors */

app.use(function (req, res, next) {
  var error = new Error('Invalid Request');
  error.status = 400;
  next(error);
});
app.use(function (error, req, res, next) {
  //logger.error(error.message, { stacktrace: error.stack })
  res.status(error.status || 500);
  res.send({
    error: {
      message: error.message
    }
  });
});
app.listen(PORT, function () {
  return console.log("Server listening on PORT: ".concat(PORT));
});
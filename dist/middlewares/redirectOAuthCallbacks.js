"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleCallBacks = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _checkLogin = require("./checkLogin");

var _googleApi = require("../services/googleApi");

//import logger from 'common/logger'
var handleCallBacks =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(req, res) {
    var code, token, _originalRequestedUrl;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            //logger.info('Handling Google OAuthClient CallBack')
            //logger.info('Requesting Access Token')
            code = req.query.code;
            if (!code) res.redirect(originalRequestedUrl);
            /* Wait for an access token based on our OAuth code */

            _context.next = 4;
            return (0, _googleApi.getAccessToken)(code);

          case 4:
            token = _context.sent;

            if (token) {
              //logger.info('Assigning Access Token to browser cookie')
              res.cookie('cookieGoogleAccessToken', token, {
                maxAge: 1000 * 60 * 60 * 24 * 365
              });
              _originalRequestedUrl = (0, _checkLogin.getOriginalRequestedUrl)();
              res.redirect(_originalRequestedUrl);
            }

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function handleCallBacks(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.handleCallBacks = handleCallBacks;
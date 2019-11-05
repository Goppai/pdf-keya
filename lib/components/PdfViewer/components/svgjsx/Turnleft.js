"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const SvgTurnleft = props => _react.default.createElement("svg", _extends({
  width: "1em",
  height: "1em",
  viewBox: "0 0 1024 1024"
}, props), _react.default.createElement("g", {
  fill: "currentColor",
  fillRule: "nonzero"
}, _react.default.createElement("path", {
  d: "M511.833 183.467V64l-268.8 149.333 268.8 149.334V243.2c197.12 0 358.4 149.333 358.4 334.507v143.36h59.734v-143.36c0-218.027-188.16-394.24-418.134-394.24z"
}), _react.default.createElement("path", {
  d: "M631.3 482.133H153.433c-32.853 0-59.733 26.88-59.733 59.734v358.4C93.7 933.12 120.58 960 153.433 960H631.3c32.853 0 59.733-26.88 59.733-59.733v-358.4c0-32.854-26.88-59.734-59.733-59.734zm0 418.134H153.433v-358.4H631.3v358.4z"
})));

var _default = SvgTurnleft;
exports.default = _default;
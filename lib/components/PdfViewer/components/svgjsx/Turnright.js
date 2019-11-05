"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const SvgTurnright = props => _react.default.createElement("svg", _extends({
  width: "1em",
  height: "1em",
  viewBox: "0 0 1024 1024"
}, props), _react.default.createElement("g", {
  fill: "currentColor",
  fillRule: "nonzero"
}, _react.default.createElement("path", {
  d: "M511.833 183.467V64l268.8 149.333-268.8 149.334V243.2c-197.12 0-358.4 149.333-358.4 334.507v143.36H93.7v-143.36c0-218.027 188.16-394.24 418.133-394.24z"
}), _react.default.createElement("path", {
  d: "M332.633 541.867v358.4c0 32.853 26.88 59.733 59.734 59.733h477.866c32.854 0 59.734-26.88 59.734-59.733v-358.4c0-32.854-26.88-59.734-59.734-59.734H392.367c-32.854 0-59.734 26.88-59.734 59.734zm59.734 0h477.866v358.4H392.367v-358.4z"
})));

var _default = SvgTurnright;
exports.default = _default;
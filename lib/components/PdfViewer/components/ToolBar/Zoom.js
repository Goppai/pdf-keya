"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _Icon = _interopRequireDefault(require("./Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Container = _styledComponents.default.div`
  display: flex;
  align-items: center;
`;
const Number = _styledComponents.default.span`
  display: block;
  min-width: 3em;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  text-align: center;
  user-select: none;
  &::after {
    content: '%';
  }
`;

const Zoom = ({
  onZoomIn,
  onZoomOut,
  zoomInDisabled,
  zoomOutDisabled,
  percent = 100
}) => _react.default.createElement(Container, null, _react.default.createElement(_Icon.default, {
  type: "zoom-out",
  pl: 12,
  pr: 8,
  disabled: zoomOutDisabled,
  onClick: zoomOutDisabled ? null : onZoomOut
}), _react.default.createElement(Number, null, percent), _react.default.createElement(_Icon.default, {
  type: "zoom-in",
  pl: 8,
  pr: 12,
  disabled: zoomInDisabled,
  onClick: zoomInDisabled ? null : onZoomIn
}));

Zoom.propTypes = {
  onZoomIn: _propTypes.default.func.isRequired,
  onZoomOut: _propTypes.default.func.isRequired,
  zoomInDisabled: _propTypes.default.bool.isRequired,
  zoomOutDisabled: _propTypes.default.bool.isRequired,
  percent: _propTypes.default.number.isRequired
};
var _default = Zoom;
exports.default = _default;
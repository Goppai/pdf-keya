"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("antd/lib/icon/style/css");

var _icon = _interopRequireDefault(require("antd/lib/icon"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _styledComponents.default)(_icon.default)`
  font-size: 14px;
  padding: 10px ${p => p.pr || 12}px 10px ${p => p.pl || 12}px;
  color: ${p => p.disabled ? 'rgba(0, 0, 0, 0.65)' : 'black'};
  &:hover:not([disabled]) {
    color: #1890ff;
  }
`;

exports.default = _default;
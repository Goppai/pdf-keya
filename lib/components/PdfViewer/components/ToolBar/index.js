"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ToolBarWrapper = void 0;

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _Container = _interopRequireDefault(require("./Container"));

var _Icon = _interopRequireDefault(require("./Icon"));

var _Zoom = _interopRequireDefault(require("./Zoom"));

var _Paging = _interopRequireDefault(require("./Paging"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ToolBarWrapper = _styledComponents.default.div`
  display: flex;
  min-width: 100%;
  text-align:center;
  align-items:center;
  justify-content: space-between;
  position: absolute;
  background: #FFFFFF;
  top: 0px;
  transform: translateX(-50%);
  left: 50%;
  z-index:102;
  opacity: ${p => p.show ? 1 : 0};
  transition: opacity 0.5s;
  user-select: none;
  box-shadow: 2px 0 8px 0 rgba(0,0,0,0.15);
`;
exports.ToolBarWrapper = ToolBarWrapper;
const ToolBar = _Container.default;
Object.assign(ToolBar, {
  Icon: _Icon.default,
  Zoom: _Zoom.default,
  Paging: _Paging.default
});
var _default = ToolBar;
exports.default = _default;
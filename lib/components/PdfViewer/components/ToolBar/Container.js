"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const Wrapper = _styledComponents.default.div`
  height: 48px;
  width:100%;
  padding: 0 5px;
  z-index: 999;
`;
const ItemWrapper = _styledComponents.default.div`
  display: inline-block;
  line-height: 48px;
`; // eslint-disable-next-line react/prop-types

const Container = ({
  children
}) => _react.default.createElement(Wrapper, null, _react.Children.map(children, element => _react.default.createElement(ItemWrapper, null, element)));

Container.propsType = {
  children: _propTypes.default.oneOfType([_propTypes.default.element, _propTypes.default.arrayOf(_propTypes.default.element)])
};
var _default = Container;
exports.default = _default;
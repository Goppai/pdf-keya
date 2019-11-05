"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Icon = _interopRequireDefault(require("./Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const Container = _styledComponents.default.div`
  display: flex;
  align-items: center;
`;
const Input = _styledComponents.default.input`
  border: none;
  outline: none;
  height: 24px;
  width: 32px;
  border-radius: 2px;
  text-align: center;
  color: rgba(0, 0, 0, 0.65);
  background: rgba(0, 0, 0, 0.25);
  &&::-webkit-outer-spin-button,
  &&::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`;
const Text = _styledComponents.default.span`
  font-size: 14px;
  margin-left: 4px;
  color: rgba(0, 0, 0, 0.65);
  user-select: none;
`;

const Paging = ({
  current = 0,
  total = 0,
  onPrev,
  onNext,
  onPageChange
}) => {
  const [pageValue, setPageValue] = (0, _react.useState)(current);
  (0, _react.useLayoutEffect)(() => {
    setPageValue(current);
  }, [current]);

  const onKeyDown = evt => {
    if (evt.key === 'Enter') {
      onPageChange(parseInt(evt.target.value, 10));
    }
  };

  const onValueChange = evt => {
    setPageValue(evt.target.value);
  };

  return _react.default.createElement(Container, null, _react.default.createElement(_Icon.default, {
    type: "left",
    mr: 8,
    onClick: onPrev
  }), _react.default.createElement(Input, {
    type: "number",
    onChange: onValueChange,
    onKeyDown: onKeyDown,
    value: pageValue
  }), _react.default.createElement(Text, null, "/ ", total), _react.default.createElement(_Icon.default, {
    type: "right",
    ml: 8,
    onClick: onNext
  }));
};

Paging.propTypes = {
  current: _propTypes.default.number.isRequired,
  total: _propTypes.default.number.isRequired,
  onPrev: _propTypes.default.func.isRequired,
  onNext: _propTypes.default.func.isRequired,
  onPageChange: _propTypes.default.func.isRequired
};
var _default = Paging;
exports.default = _default;
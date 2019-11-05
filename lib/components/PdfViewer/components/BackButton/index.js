"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("antd/lib/icon/style/css");

var _icon = _interopRequireDefault(require("antd/lib/icon"));

require("antd/lib/button/style/css");

var _button = _interopRequireDefault(require("antd/lib/button"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _urlUtil = require("../../../../utils/urlUtil");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Wrapper = _styledComponents.default.div`
  font-size: 14px;
  color: #1890ff;
  cursor: pointer;
  user-select: none;
`;

function BackButton({
  isTextButton
}) {
  const clickCallback = (0, _react.useCallback)(async () => {
    const backUrl = (0, _urlUtil.getBackUrl)(); // window.open(backUrl, '_self');

    window.location = backUrl;
  }, []);
  const backText = '返回';

  if (!isTextButton) {
    return _react.default.createElement(_button.default, {
      onClick: clickCallback,
      style: {
        width: 126
      },
      type: "primary"
    }, backText);
  }

  return _react.default.createElement(Wrapper, {
    onClick: clickCallback
  }, _react.default.createElement(_icon.default, {
    type: "left",
    style: {
      marginRight: 8
    }
  }), backText);
}

BackButton.propTypes = {
  isTextButton: _propTypes.default.bool.isRequired
};
var _default = BackButton;
exports.default = _default;
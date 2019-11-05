"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("antd/lib/icon/style/css");

var _icon = _interopRequireDefault(require("antd/lib/icon"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Print = ({
  pdfData,
  url
}) => {
  const iframeRef = (0, _react.useRef)();

  const print = () => {
    if (window.require) {
      const {
        ipcRenderer
      } = window.require('electron');

      ipcRenderer.send('print', url);
    } else {
      const iframe = iframeRef.current;
      const URL = window.URL || window.webkitURL;
      const blob = new Blob([pdfData], {
        type: 'application/pdf'
      });
      const objectURL = URL.createObjectURL(blob);
      iframe.src = objectURL;

      iframe.onload = () => {
        URL.revokeObjectURL(objectURL);
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      };
    }
  };

  return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_icon.default, {
    type: "printer",
    onClick: print
  }), _react.default.createElement("iframe", {
    ref: iframeRef,
    title: Math.random(),
    style: {
      display: 'none'
    }
  }));
};

Print.propTypes = {
  url: _propTypes.default.string.isRequired,
  pdfData: _propTypes.default.instanceOf(Object).isRequired
};
var _default = Print;
exports.default = _default;
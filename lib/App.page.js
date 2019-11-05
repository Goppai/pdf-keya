"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "PDFViewer", {
  enumerable: true,
  get: function () {
    return _PdfViewer.default;
  }
});
Object.defineProperty(exports, "forceFileDownload", {
  enumerable: true,
  get: function () {
    return _forceFileDownload.default;
  }
});
Object.defineProperty(exports, "Preview", {
  enumerable: true,
  get: function () {
    return _preview.default;
  }
});
Object.defineProperty(exports, "Deformation", {
  enumerable: true,
  get: function () {
    return _components.Deformation;
  }
});
Object.defineProperty(exports, "PageTurning", {
  enumerable: true,
  get: function () {
    return _components.PageTurning;
  }
});
Object.defineProperty(exports, "PrevAndNext", {
  enumerable: true,
  get: function () {
    return _components.PrevAndNext;
  }
});
Object.defineProperty(exports, "Print", {
  enumerable: true,
  get: function () {
    return _components.Print;
  }
});
Object.defineProperty(exports, "Rotate", {
  enumerable: true,
  get: function () {
    return _components.Rotate;
  }
});
Object.defineProperty(exports, "BackButton", {
  enumerable: true,
  get: function () {
    return _components.BackButton;
  }
});
Object.defineProperty(exports, "Reset", {
  enumerable: true,
  get: function () {
    return _components.Reset;
  }
});
exports.default = void 0;

require("antd/lib/icon/style/css");

var _icon = _interopRequireDefault(require("antd/lib/icon"));

var _react = _interopRequireWildcard(require("react"));

var _PdfViewer = _interopRequireDefault(require("./components/PdfViewer"));

var _forceFileDownload = _interopRequireDefault(require("./utils/forceFileDownload"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _preview = _interopRequireDefault(require("./components/PdfViewer/preview"));

var _ev = _interopRequireDefault(require("./ev"));

var _components = require("./components/PdfViewer/components");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-unused-vars */
const pdf = {
  url: 'http://api.ip-10-3-7-254.bj.keyayun.com:8080/files/downloads/8bc9a6d335329586/冠状动脉CTA检查报告 (1).pdf'
};
const Wrapper = _styledComponents.default.div`
  display: block;
  height: calc(100%);
  background-color: rgba(0, 0, 0, 0.04);
  user-select: none;
`;
const Operating = _styledComponents.default.div`
  height: 67px;
  display: flex;
  position:relative;
  align-items: center;
  background: #fff;
  box-shadow: 2px 0 8px 0 rgba(0, 0, 0, 0.15);
  justify-content: space-between;
  min-width:1280px;
  padding:0px 117px 0px 24px;
`;
const OperatingBox = _styledComponents.default.div`
  width: 28%;
  display: flex;
  align-items: center;
  margin-left:15%;
  justify-content: space-between;
`;
const PageBox = _styledComponents.default.div`
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const PrintBox = _styledComponents.default.div`
width: 5%;
display: flex;
align-items: center;
justify-content: space-between;
`;
const PreviewWrapper = _styledComponents.default.div`
  flex-shrink: 0;
  flex-grow: 0;
  width: 240px;
  height: 100%;
  background: #fff;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  box-shadow: 2px 0 8px 0 rgba(0,0,0,0.15);
  display: ${props => props.showPreview ? 'flex' : 'none'};
`;
const ViewerWrapper = _styledComponents.default.div`
  display: flex;
  width: ${props => props.showPreview ? 'calc(100% - 120px)' : '100%'};
  justify-content: center;
  align-items: center;
  height: 100%;
  background-clip: content-box;
`;
const PDFViewerWrapper = _styledComponents.default.div`
  display: flex;
  width: calc(100%);
  // flex-direction: column;
  // justify-content: center;
  // box-sizing: border-box;
  // align-items: center;
  // flex-shrink: 0;
  margin-left: 4px;
  height: calc(100% - 67px);
  background-clip: content-box;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.03);
`;

const App = () => {
  const wrapper = (0, _react.useRef)();
  const [showPreview, setShowPreview] = (0, _react.useState)(true);
  (0, _react.useEffect)(() => {
    _ev.default.addListener('isShow', () => {
      setShowPreview(!showPreview);
    });
  });
  return _react.default.createElement(Wrapper, {
    ref: wrapper
  }, _react.default.createElement(Operating, null, _react.default.createElement(_components.BackButton, {
    isTextButton: true
  }), _react.default.createElement(OperatingBox, null, _react.default.createElement(_components.Deformation, null), _react.default.createElement(_components.Reset, null), _react.default.createElement(PageBox, null, _react.default.createElement(_components.PrevAndNext, {
    iconType: "left"
  }), _react.default.createElement(_components.PageTurning, null), _react.default.createElement(_components.PrevAndNext, null)), _react.default.createElement(_components.Rotate, null), _react.default.createElement(_components.Rotate, {
    degree: 0
  })), _react.default.createElement(PrintBox, null, _react.default.createElement(_icon.default, {
    type: "download",
    onClick: () => (0, _forceFileDownload.default)(pdf.url, pdf.url)
  }), _react.default.createElement(_components.Print, null))), _react.default.createElement(PDFViewerWrapper, null, _react.default.createElement(PreviewWrapper, {
    showPreview: true
  }, _react.default.createElement(_preview.default, {
    onError: console.error // eslint-disable-line
    ,
    url: pdf.url
  })), _react.default.createElement(_PdfViewer.default, {
    onError: console.error // eslint-disable-line
    ,
    url: pdf.url,
    pdfData: pdf,
    download: () => (0, _forceFileDownload.default)(pdf.url, pdf.url),
    wrapper: wrapper
  })));
};

var _default = App;
exports.default = _default;
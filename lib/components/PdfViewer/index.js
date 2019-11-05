"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _pdfjsDist = _interopRequireDefault(require("pdfjs-dist"));

var _ev = _interopRequireDefault(require("../../ev"));

var _Turnleft = _interopRequireDefault(require("./components/svgjsx/Turnleft"));

var _Turnright = _interopRequireDefault(require("./components/svgjsx/Turnright"));

var _ToolBar = _interopRequireWildcard(require("./components/ToolBar"));

var _Controller = _interopRequireDefault(require("./Controller"));

require("pdfjs-dist/web/pdf_viewer.css");

var _withLoading = _interopRequireDefault(require("./withLoading"));

var _Icon = _interopRequireDefault(require("./components/ToolBar/Icon"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-nested-ternary */

/* eslint-disable react/destructuring-assignment */
_pdfjsDist.default.GlobalWorkerOptions.workerSrc = 'pdf.worker.js'; // const pdfjsWorker = import('pdfjs-dist/build/pdf.worker.entry');

const Container = _styledComponents.default.div`
  width: 100%;
  height: 100%;
`;
const ViewerContainer = _styledComponents.default.div`
  height: 100%;
  width: 100%;
  overflow: auto !important;
  text-align: center;
  .pdfViewer {
    height: calc(100% - 4px) !important;
    transform: scale(1);
    transform-origin: top left;
  }
  .pdfViewer .page {
    border: 2px;
    border-top: 0px;
    margin-bottom: 10px;
    padding-top:23px;
  }
  .canvasWrapper{
    box-shadow: 0 4px 8px 0 rgba(130,130,130,0.50);
  }
`;
const HoverShowToolBar = _styledComponents.default.div`
  width: 100%;
  height: 80px;
  position: absolute;
  top: 0px;
  transform: translateX(-50%);
  left: 50%;
  z-index: 101;
  background: rgba(0, 0, 0, 0);
  display: none;
`;
const EscFullScreen = _styledComponents.default.div`
  color: blue;
  width: 100px;
`;
const Box = _styledComponents.default.div`
  display: flex;
  align-items: center;
`;
const ZOOM_DEFAULT = 100;
const ZOOM_MAX = 1000;
const ZOOM_MIN = 20;
const ZOOM_STEP = 10;

class PdfViewer extends _react.default.Component {
  constructor(...args) {
    super(...args);
    this.pdfContainer = _react.default.createRef();
    this.pdfViewer = _react.default.createRef();
    this.iframeRef = _react.default.createRef();
    this.toolBar = _react.default.createRef();
    this.HoverShowToolBar = _react.default.createRef();
    this.textInput = void 0;
    this.timer = null;
    this.controller = null;
    this.state = {
      showToolbar: true,
      totalPage: 0,
      currentPage: 1,
      scaleValue: ZOOM_DEFAULT
    };

    this.onResize = () => {
      let proportion = window.innerWidth / window.screen.width;
      if (window.innerWidth < 1280) proportion = 1280 / 1920;
      this.controller.scale(proportion + 0.2);
    };

    this.onPageInit = () => {
      // this.onResize();
      this.controller.scale(1.2); // this.controller.scale('auto');
    };

    this.onScaleChange = evt => {
      if (Math.round(evt.scale * 100) <= 20) {
        return;
      }

      this.setState({
        scaleValue: Math.round(evt.scale * 100)
      });

      _ev.default.emit('scaleValue', Math.round(evt.scale * 100));
    };

    this.onPrevClick = () => {
      this.controller.setPage(this.state.currentPage - 1);
    };

    this.isShowPreview = () => {
      _ev.default.emit('isShow', this.controller);
    };

    this.onNextClick = () => {
      this.controller.setPage(this.state.currentPage + 1);
    };

    this.onRotateLeft = () => {
      this.controller.rotate(-90);
    };

    this.onRotateRight = () => {
      this.controller.rotate(90);
    };

    this.handleGotoPage = page => {
      this.controller.setPage(page);
    };

    this.onPageChange = ({
      pageNumber
    }) => {
      this.setState({
        currentPage: pageNumber
      });

      _ev.default.emit('currentPage', pageNumber);
    };

    this.zoomStep = step => {
      const diff = this.state.scaleValue % ZOOM_STEP; // eslint-disable-next-line no-unused-vars

      const data = diff ? step > 0 ? ZOOM_STEP - diff : -diff : step;
      this.controller.scale((this.state.scaleValue + data) / 100);
    };

    this.onZoomIn = () => {
      if (this.state.scaleValue < ZOOM_MAX) {
        this.zoomStep(+ZOOM_STEP);
      }
    };

    this.onZoomOut = () => {
      if (this.state.scaleValue > ZOOM_MIN) {
        this.zoomStep(-ZOOM_STEP);
      }
    };

    this.onMouseEnter = () => {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      this.setState({
        showToolbar: true
      });
    };

    this.onMouseLeave = () => {
      if (!this.timer) {
        this.timer = setTimeout(() => {
          this.setState({
            showToolbar: true
          });
        }, 2000);
      }
    };

    this.print = () => {
      const {
        pdfData,
        url
      } = this.props;

      if (window.require) {
        const {
          ipcRenderer
        } = window.require('electron');

        ipcRenderer.send('print', url);
      } else {
        const iframe = this.iframeRef.current;
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
  }

  componentDidMount() {
    this.controller = new _Controller.default(this.pdfContainer.current);

    _ev.default.emit('callMe', this.controller);

    this.controller.eventBus.on('pagechanging', this.onPageChange);
    this.controller.eventBus.on('scalechanging', this.onScaleChange);
    this.pdfContainer.current.addEventListener('pagesinit', this.onPageInit);
    this.HoverShowToolBar.current.addEventListener('mouseover', this.pdfHover);
    window.addEventListener('resize', this.onResize);
    this.loadDocument(this.props.url);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.url !== '' && nextProps.url !== this.props.url) {
      this.loadDocument(nextProps.url);
    }
  }

  componentWillUnmount() {
    if (this.doc) {
      this.doc.destroy();
      this.doc = null;
    }

    this.controller = null;
  }

  async loadDocument(url) {
    const {
      setLoading,
      onError
    } = this.props;

    try {
      this.doc = await _pdfjsDist.default.getDocument(url);

      if (this.controller) {
        this.setState({
          totalPage: this.doc.numPages
        });

        _ev.default.emit('totalPage', this.doc.numPages);

        this.controller.loadDoc(this.doc);
      } else {
        this.doc.destroy();
        this.doc = null;
      }
    } catch (error) {
      onError(error);
    }

    setLoading(false);
  }

  render() {
    const {
      download
    } = this.props;
    const {
      showToolbar,
      currentPage,
      totalPage,
      scaleValue
    } = this.state;
    return _react.default.createElement(Container, {
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave
    }, _react.default.createElement(HoverShowToolBar, {
      ref: this.HoverShowToolBar,
      onMouseEnter: this.pdfHover,
      onMouseLeave: this.pdfHoverLeave
    }), _react.default.createElement(ViewerContainer, {
      ref: this.pdfContainer,
      id: "frame"
    }, _react.default.createElement("div", {
      id: "viewer",
      className: "pdfViewer",
      ref: this.pdfViewer
    })), _react.default.createElement("iframe", {
      ref: this.iframeRef,
      title: Math.random(),
      style: {
        display: 'none'
      }
    }), false && _react.default.createElement(_ToolBar.ToolBarWrapper, {
      show: showToolbar,
      ref: this.toolBar,
      onMouseEnter: this.pdfHover
    }, _react.default.createElement(EscFullScreen, {
      onClick: this.escFullScreen
    }, "\u9000\u51FA\u5168\u5C4F"), _react.default.createElement(_ToolBar.default, null, _react.default.createElement(Box, null, _react.default.createElement(_Icon.default, {
      type: "menu-unfold",
      onClick: this.isShowPreview
    }), _react.default.createElement(_Icon.default, {
      type: "fullscreen",
      onClick: this.fullScreen
    })), _react.default.createElement(Box, null, _react.default.createElement(_ToolBar.default.Icon, {
      component: _Turnleft.default,
      onClick: this.onRotateLeft
    }), _react.default.createElement(_ToolBar.default.Icon, {
      component: _Turnright.default,
      onClick: this.onRotateRight
    })), _react.default.createElement(_ToolBar.default.Zoom, {
      percent: scaleValue,
      onZoomIn: this.onZoomIn,
      onZoomOut: this.onZoomOut,
      zoomOutDisabled: scaleValue <= ZOOM_MIN,
      zoomInDisabled: scaleValue >= ZOOM_MAX
    }), _react.default.createElement(_ToolBar.default.Paging, {
      current: currentPage,
      total: totalPage,
      onPageChange: this.handleGotoPage,
      onPrev: this.onPrevClick,
      onNext: this.onNextClick,
      download: () => download(),
      preview: this.print
    })), _react.default.createElement(Box, null, _react.default.createElement(_Icon.default, {
      type: "download",
      onClick: download
    }), _react.default.createElement(_Icon.default, {
      type: "printer",
      onClick: this.print
    }))));
  }

}

PdfViewer.propTypes = {
  url: _propTypes.default.string.isRequired,
  setLoading: _propTypes.default.func.isRequired,
  onError: _propTypes.default.func.isRequired,
  download: _propTypes.default.func.isRequired,
  pdfData: _propTypes.default.instanceOf(Object).isRequired // wrapper: PropTypes.element.isRequired,

};

var _default = _react.default.memo((0, _withLoading.default)(PdfViewer));

exports.default = _default;
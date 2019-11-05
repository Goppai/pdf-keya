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

var _Controller = _interopRequireDefault(require("./Controller"));

require("pdfjs-dist/web/pdf_viewer.css");

var _withLoading = _interopRequireDefault(require("./withLoading"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

// PDFJS.GlobalWorkerOptions.workerSrc = 'pdf.worker.js';
const pdfjsWorker = Promise.resolve().then(() => _interopRequireWildcard(require('pdfjs-dist/build/pdf.worker.entry')));
_pdfjsDist.default.GlobalWorkerOptions.workerSrc = pdfjsWorker;
const Container = _styledComponents.default.div`
  width: 100%;
  height: 100%;
`;
const ViewerContainer = _styledComponents.default.div`
  height: 100%;
  width: 100%;
  overflow: auto !important;
  text-align: center;
  .pdfViewer .page {
    border-radius: 2px;
    border: 2px;
    border-top: 0px;
    margin-bottom: 4px;
    margin-top: 30px;
    box-shadow: 0 4px 8px 0 rgba(130,130,130,0.50);
  }
  .pdfViewer .page:nth-of-type(n)::after {
    content: attr(data-page-number);
  }
`;

class PdfViewer extends _react.default.Component {
  constructor(...args) {
    super(...args);
    this.pdfContainer = _react.default.createRef();
    this.pdfViewer = _react.default.createRef();
    this.iframeRef = _react.default.createRef();
    this.textInput = void 0;
    this.timer = null;
    this.controller = null;
    this.state = {
      clickPage: null,
      pdfViewer: null
    };

    this.onPageInit = () => {
      // this.onResize();
      this.controller.scale(0.16);
    };

    this.handleGotoPage = page => {
      this.controller.setPage(page);
    };

    this.onClickPage = e => {
      if (e.target.className !== 'textLayer') {
        return;
      }

      if (e.target !== this.state.clickPage && this.state.clickPage) {
        this.state.clickPage.style.border = `${0}px solid blue`;
      }

      e.target.style.border = `${2}px solid #1890FF`;
      this.setState({
        clickPage: e.target
      });
      const num = e.target.parentNode.getAttribute('data-page-number');
      this.state.pdfViewer.setPage(Number(num));
    };
  }

  componentDidMount() {
    this.controller = new _Controller.default(this.pdfContainer.current);
    this.eventEmitter = _ev.default.addListener('callMe', msg => {
      this.setState({
        pdfViewer: msg
      });
    });
    this.pdfContainer.current.addEventListener('pagesinit', this.onPageInit);
    this.pdfContainer.current.addEventListener('click', this.onClickPage);
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
    return _react.default.createElement(Container, null, _react.default.createElement(ViewerContainer, {
      ref: this.pdfContainer,
      id: "frame"
    }, _react.default.createElement("div", {
      id: "viewer",
      className: "pdfViewer",
      ref: this.pdfViewer
    })));
  }

}

PdfViewer.propTypes = {
  url: _propTypes.default.string.isRequired,
  setLoading: _propTypes.default.func.isRequired,
  onError: _propTypes.default.func.isRequired
};

var _default = _react.default.memo((0, _withLoading.default)(PdfViewer));

exports.default = _default;
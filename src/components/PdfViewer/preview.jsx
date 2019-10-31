/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import PDFJS from 'pdfjs-dist';
import emitter from 'utils/ev';
import ToolBar, { ToolBarWrapper } from './components/ToolBar';
import Controller from './Controller';
import 'pdfjs-dist/web/pdf_viewer.css';
import withLoading from './withLoading';

PDFJS.GlobalWorkerOptions.workerSrc = 'pdf.worker.js';
// const pdfjsWorker = import('pdfjs-dist/build/pdf.worker.entry');


const Container = styled.div`
  width: 100%;
  height: 100%;
`;
const ViewerContainer = styled.div`
  height: 100%;
  width: 100%;
  overflow: auto !important;
  text-align: center;
  .pdfViewer .page {
    border: 2px;
    border-top: 0px;
    margin-bottom: 4px;
    margin-top: 30px;  
  }
  .pdfViewer .page:nth-of-type(n)::after {
    content:attr(data-page-number);
  }
`;

const ZOOM_DEFAULT = 100;
const ZOOM_MAX = 1000;
const ZOOM_MIN = 20;
const ZOOM_STEP = 10;
class PdfViewer extends React.Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    setLoading: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
  };

  pdfContainer = React.createRef();

  pdfViewer = React.createRef();

  iframeRef = React.createRef();

  textInput;

  timer = null;

  controller = null;

  state = {
    showToolbar: true,
    totalPage: 0,
    currentPage: 1,
    scaleValue: ZOOM_DEFAULT,
    clickPage: null,
    pdfViewer: null,
  };

  componentDidMount() {
    this.controller = new Controller(this.pdfContainer.current);
    this.eventEmitter = emitter.addListener('callMe', (msg) => {
      this.setState({ pdfViewer: msg });
    });
    this.controller.eventBus.on('pagechanging', this.onPageChange);
    this.controller.eventBus.on('scalechanging', this.onScaleChange);
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


  onPageInit = () => {
    // this.onResize();
    this.controller.scale(0.1);
  };

  onScaleChange = (evt) => {
    this.setState({ scaleValue: Math.round(evt.scale * 100) });
  };

  handleGotoPage = (page) => {
    this.controller.setPage(page);
  };

  onPageChange = ({ pageNumber }) => {
    this.setState({ currentPage: pageNumber });
  };

  onClickPage = (e) => {
    if (e.target.className !== 'textLayer') { return; }
    if (e.target !== this.state.clickPage && this.state.clickPage) { this.state.clickPage.style.border = `${0}px solid blue`; }
    e.target.style.border = `${1}px solid blue`;
    this.setState({ clickPage: e.target });
    const num = e.target.parentNode.getAttribute('data-page-number');
    this.state.pdfViewer.setPage(Number(num));
  }

  zoomStep = (step) => {
    const diff = this.state.scaleValue % ZOOM_STEP;
    // eslint-disable-next-line no-unused-vars
    const data = diff ? (step > 0 ? ZOOM_STEP - diff : -diff) : step;
    this.controller.scale((this.state.scaleValue + data) / 100);
  };

  async loadDocument(url) {
    const { setLoading, onError } = this.props;
    try {
      this.doc = await PDFJS.getDocument(url);
      if (this.controller) {
        this.setState({ totalPage: this.doc.numPages });
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
    const { loading } = this.props;
    const {
      showToolbar, currentPage, totalPage, scaleValue,
    } = this.state;

    return (
      <Container >
        <ViewerContainer ref={this.pdfContainer} id="frame">
          <div id="viewer" className="pdfViewer" ref={this.pdfViewer} />
        </ViewerContainer>
      </Container>
    );
  }
}

export default React.memo(withLoading(PdfViewer));

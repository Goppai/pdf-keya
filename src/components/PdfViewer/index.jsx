/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import PDFJS from 'pdfjs-dist';
import ToolBar, { ToolBarWrapper } from './components/ToolBar';
import Controller from './Controller';
import 'pdfjs-dist/web/pdf_viewer.css';
import withLoading from './withLoading';

// PDFJS.GlobalWorkerOptions.workerSrc = 'pdf.worker.js';
const pdfjsWorker = import('pdfjs-dist/build/pdf.worker.entry');
PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;


const Container = styled.div`
  width: 100%;
  height: 100%;
`;
const ViewerContainer = styled.div`
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
    margin-bottom: 4px;
    margin-top: 0px;
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
    download: PropTypes.func.isRequired,
    pdfData: PropTypes.instanceOf(Object).isRequired,
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
  };

  componentDidMount() {
    this.controller = new Controller(this.pdfContainer.current);
    this.controller.eventBus.on('pagechanging', this.onPageChange);
    this.controller.eventBus.on('scalechanging', this.onScaleChange);
    this.pdfContainer.current.addEventListener('pagesinit', this.onPageInit);
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

  onResize = () => {
    const proportion = window.innerWidth / window.screen.width;

    this.controller.scale(proportion - 0.24);
  };

  onPageInit = () => {
    this.onResize();
    // this.controller.scale('auto');
  };

  onScaleChange = (evt) => {
    this.setState({ scaleValue: Math.round(evt.scale * 100) });
  };

  onPrevClick = () => {
    this.controller.setPage(this.state.currentPage - 1);
  };

  onNextClick = () => {
    this.controller.setPage(this.state.currentPage + 1);
  };

  handleGotoPage = (page) => {
    this.controller.setPage(page);
  };

  onPageChange = ({ pageNumber }) => {
    this.setState({ currentPage: pageNumber });
  };

  zoomStep = (step) => {
    const diff = this.state.scaleValue % ZOOM_STEP;
    // eslint-disable-next-line no-unused-vars
    const data = diff ? (step > 0 ? ZOOM_STEP - diff : -diff) : step;
    this.controller.scale((this.state.scaleValue + data) / 100);
  };

  onZoomIn = () => {
    if (this.state.scaleValue < ZOOM_MAX) {
      this.zoomStep(+ZOOM_STEP);
    }
  };

  onZoomOut = () => {
    if (this.state.scaleValue > ZOOM_MIN) {
      this.zoomStep(-ZOOM_STEP);
    }
  };

  onMouseEnter = () => {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.setState({
      showToolbar: true,
    });
  };

  onMouseLeave = () => {
    if (!this.timer) {
      this.timer = setTimeout(() => {
        this.setState({
          showToolbar: true,
        });
      }, 2000);
    }
  };

  print = () => {
    const { pdfData, url } = this.props;
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.send('print', url);
    } else {
      const iframe = this.iframeRef.current;

      const URL = window.URL || window.webkitURL;
      const blob = new Blob([pdfData], { type: 'application/pdf' });
      const objectURL = URL.createObjectURL(blob);

      iframe.src = url;
      iframe.onload = () => {
        URL.revokeObjectURL(objectURL);
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      };
    }
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
    const { loading, download } = this.props;
    const {
      showToolbar, currentPage, totalPage, scaleValue,
    } = this.state;

    return (
      <Container onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        <ViewerContainer ref={this.pdfContainer} id="frame">
          <div id="viewer" className="pdfViewer" ref={this.pdfViewer} />
        </ViewerContainer>
        <iframe ref={this.iframeRef} title={Math.random()} style={{ display: 'none' }} />
        {!loading && (
          <ToolBarWrapper show={showToolbar}>
            <ToolBar>
              <ToolBar.Zoom
                percent={scaleValue}
                onZoomIn={this.onZoomIn}
                onZoomOut={this.onZoomOut}
                zoomOutDisabled={scaleValue <= ZOOM_MIN}
                zoomInDisabled={scaleValue >= ZOOM_MAX}
              />
              <ToolBar.Paging
                current={currentPage}
                total={totalPage}
                onPageChange={this.handleGotoPage}
                onPrev={this.onPrevClick}
                onNext={this.onNextClick}
                download={() => download()}
                preview={this.print}
              />
            </ToolBar>
          </ToolBarWrapper>
        )}
      </Container>
    );
  }
}

export default React.memo(withLoading(PdfViewer));

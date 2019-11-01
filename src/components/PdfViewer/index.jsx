/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import PDFJS from 'pdfjs-dist';
import emitter from 'ev';
import RotateLeft from './components/svgjsx/Turnleft';
import RotateRight from './components/svgjsx/Turnright';
import ToolBar, { ToolBarWrapper } from './components/ToolBar';
import Controller from './Controller';
import 'pdfjs-dist/web/pdf_viewer.css';
import withLoading from './withLoading';
import Icon from './components/ToolBar/Icon';

PDFJS.GlobalWorkerOptions.workerSrc = 'pdf.worker.js';
// const pdfjsWorker = import('pdfjs-dist/build/pdf.worker.entry');

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.03);
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
const HoverShowToolBar = styled.div`
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
const EscFullScreen = styled.div`
  color: blue;
  width: 100px;
`;
const Box = styled.div`
  display: flex;
  align-items: center;
`;

const ZOOM_DEFAULT = 100;
const ZOOM_MAX = 1000;
const ZOOM_MIN = 20;
const ZOOM_STEP = 10;
class PdfViewer extends React.Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    setLoading: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    download: PropTypes.func.isRequired,
    pdfData: PropTypes.instanceOf(Object).isRequired,
    // wrapper: PropTypes.element.isRequired,
  };

  pdfContainer = React.createRef();

  pdfViewer = React.createRef();

  iframeRef = React.createRef();

  toolBar = React.createRef();

  HoverShowToolBar = React.createRef();

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
    emitter.emit('callMe', this.controller);
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

  onResize = () => {
    const proportion = window.innerWidth / window.screen.width;

    this.controller.scale(proportion - 0.24);
  };

  onPageInit = () => {
    this.onResize();
    // this.controller.scale('auto');
  };

  onScaleChange = (evt) => {
    if (Math.round(evt.scale * 100) === 10) { return; }
    this.setState({ scaleValue: Math.round(evt.scale * 100) });
    emitter.emit('scaleValue', Math.round(evt.scale * 100));
  };

  onPrevClick = () => {
    this.controller.setPage(this.state.currentPage - 1);
  };

  isShowPreview = () => {
    emitter.emit('isShow', this.controller);
  }

  onNextClick = () => {
    this.controller.setPage(this.state.currentPage + 1);
  };

  onRotateLeft = () => {
    this.controller.rotate(-90);
  };

  onRotateRight = () => {
    this.controller.rotate(90);
  };

  handleGotoPage = (page) => {
    this.controller.setPage(page);
  };

  onPageChange = ({ pageNumber }) => {
    this.setState({ currentPage: pageNumber });
    emitter.emit('currentPage', pageNumber);
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

  // fullScreen = () => {
  //   const { wrapper } = this.props;
  //   wrapper.current.style.marginTop = `${0}px`;
  //   wrapper.current.style.height = '100%';
  //   this.toolBar.current.style.display = 'none';
  //   this.HoverShowToolBar.current.style.display = 'flex';
  // };

  // escFullScreen = () => {
  //   const { wrapper } = this.props;
  //   wrapper.current.style.marginTop = `${40}px`;
  //   wrapper.current.style.height = 'calc(100% - 40px)';
  //   this.toolBar.current.style.display = 'flex';
  //   this.HoverShowToolBar.current.style.display = 'none';
  // };

  // pdfHover = () => {
  //   this.toolBar.current.style.display = 'flex';
  // };

  // pdfHoverLeave = () => {
  //   this.toolBar.current.style.display = 'none';
  // };

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

      iframe.src = objectURL;
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
        emitter.emit('totalPage', this.doc.numPages);
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
    const { download } = this.props;
    const {
      showToolbar, currentPage, totalPage, scaleValue,
    } = this.state;
    return (
      <Container onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        <HoverShowToolBar
          ref={this.HoverShowToolBar}
          onMouseEnter={this.pdfHover}
          onMouseLeave={this.pdfHoverLeave}
        />
        <ViewerContainer ref={this.pdfContainer} id="frame">
          <div id="viewer" className="pdfViewer" ref={this.pdfViewer} />
        </ViewerContainer>
        <iframe ref={this.iframeRef} title={Math.random()} style={{ display: 'none' }} />
        {false && (
          <ToolBarWrapper show={showToolbar} ref={this.toolBar} onMouseEnter={this.pdfHover}>
            <EscFullScreen onClick={this.escFullScreen}>退出全屏</EscFullScreen>
            <ToolBar>
              <Box>
                <Icon type="menu-unfold" onClick={this.isShowPreview} />
                <Icon type="fullscreen" onClick={this.fullScreen}/>
              </Box>
              <Box>
                <ToolBar.Icon component={RotateLeft} onClick={this.onRotateLeft} />
                <ToolBar.Icon component={RotateRight} onClick={this.onRotateRight} />
              </Box>
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
            <Box>
              <Icon type="download" onClick={download} />
              <Icon type="printer" onClick={this.print} />
            </Box>
          </ToolBarWrapper>
        )}
      </Container>
    );
  }
}

export default React.memo(withLoading(PdfViewer));

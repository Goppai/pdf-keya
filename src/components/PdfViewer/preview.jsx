/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import PDFJS from 'pdfjs-dist';
import emitter from 'ev';
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

class PdfViewer extends React.Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
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
    clickPage: null,
    pdfViewer: null,
  };

  componentDidMount() {
    this.controller = new Controller(this.pdfContainer.current);
    this.eventEmitter = emitter.addListener('callMe', (msg) => {
      this.setState({ pdfViewer: msg });
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

  onPageInit = () => {
    // this.onResize();
    this.controller.scale(0.16);
  };

  handleGotoPage = (page) => {
    this.controller.setPage(page);
  };


  onClickPage = (e) => {
    if (e.target.className !== 'textLayer') {
      return;
    }
    if (e.target !== this.state.clickPage && this.state.clickPage) {
      this.state.clickPage.style.border = `${0}px solid blue`;
    }
    e.target.style.border = `${2}px solid #1890FF`;
    this.setState({ clickPage: e.target });
    const num = e.target.parentNode.getAttribute('data-page-number');
    this.state.pdfViewer.setPage(Number(num));
  };

  async loadDocument(url) {
    const { setLoading, onError } = this.props;
    try {
      this.doc = await PDFJS.getDocument(url);
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
    return (
      <Container>
        <ViewerContainer ref={this.pdfContainer} id="frame">
          <div id="viewer" className="pdfViewer" ref={this.pdfViewer} />
        </ViewerContainer>
      </Container>
    );
  }
}

export default React.memo(withLoading(PdfViewer));

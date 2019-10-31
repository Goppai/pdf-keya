import React, { useRef, useEffect, useState } from 'react';
import PDFViewer from 'components/PdfViewer';
import forceFileDownload from 'utils/forceFileDownload';
import styled from 'styled-components';
import Preview from 'components/PdfViewer/preview';
import emitter from 'utils/ev';

const pdf = {
  url:
    'http://api.ip-10-3-7-254.bj.keyayun.com:8080/files/downloads/82dc0d219deb9cf7/冠状动脉CTA检查报告 (1).pdf',
};
const Wrapper = styled.div`
  display: flex;
  height: calc(100% - 40px);
  background-color: rgba(0, 0, 0, 0.08);
  user-select: none;
  margin-top:40px;
`;
const PreviewWrapper = styled.div`
  flex-shrink: 0;
  flex-grow: 0;
  width: 120px;
  height: 100%;
  background: #fff;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  display:${props => (props.showPreview ? 'flex' : 'none')}
`;
const ViewerWrapper = styled.div`
  display: flex;
  width: ${props => (props.showPreview ? 'calc(100% - 120px)' : '100%')};
  justify-content: center;
  align-items: center;
  height: 100%;
  background-clip: content-box;
`;
const PDFViewerWrapper = styled.div`
  display: flex;
  width: calc(100%);
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  align-items: center;
  flex-shrink: 0;
  margin-left: 4px;
  height: 100%;
  background-clip: content-box;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.03);
`;
const App = () => {
  const wrapper = useRef();
  const [showPreview, setShowPreview] = useState(true);
  useEffect(() => {
    emitter.addListener('isShow', () => {
      setShowPreview(!showPreview);
    });
  });
  return (<Wrapper ref={wrapper}>
    <PreviewWrapper showPreview={showPreview}>
      <Preview
        onError={console.error} // eslint-disable-line
        url={pdf.url}
      />
    </PreviewWrapper>
    <ViewerWrapper showPreview={showPreview}>
      <PDFViewerWrapper>
        <PDFViewer
          onError={console.error} // eslint-disable-line
          url={pdf.url}
          pdfData={pdf}
          download={() => forceFileDownload(pdf.url, pdf.url)}
          wrapper={wrapper}
        />
      </PDFViewerWrapper>
    </ViewerWrapper>
  </Wrapper>);
};

export default App;

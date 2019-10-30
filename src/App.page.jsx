import React from 'react';
import PDFViewer from 'components/PdfViewer';
import forceFileDownload from 'utils/forceFileDownload';
import styled from 'styled-components';

const pdf = {
  url:
    'http://api.ip-10-3-7-254.bj.keyayun.com:8080/files/downloads/d058ede4d6f22a1e/冠状动脉CTA检查报告 (1).pdf',
};
const PDFViewerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  align-items: center;
  flex-shrink: 0;
  margin-left: 4px;
  height: 100%;
  background-clip: content-box;
  overflow: hidden;
  background: rgba(0,0,0,0.03);
`;
const App = () => (
  <PDFViewerWrapper>
  <PDFViewer
    onError={console.error} // eslint-disable-line
    url={pdf.url}
    pdfData={pdf}
    download={() => forceFileDownload(pdf.url, pdf.url)}
  />
  </PDFViewerWrapper>
);

export default App;

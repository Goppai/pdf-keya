/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useState } from 'react';
import PDFViewer from 'components/PdfViewer';
import forceFileDownload from 'utils/forceFileDownload';
import styled from 'styled-components';
import Preview from 'components/PdfViewer/preview';
import emitter from 'ev';
import { Icon } from 'antd';
import {
  Deformation,
  PageTurning,
  PrevAndNext,
  Print,
  Rotate,
  BackButton,
  Reset,
} from 'components/PdfViewer/components';

const pdf = {
  url:
    'http://api.ip-10-3-7-254.bj.keyayun.com:8080/files/downloads/8bc9a6d335329586/冠状动脉CTA检查报告 (1).pdf',
};
const Wrapper = styled.div`
  display: block;
  height: calc(100%);
  background-color: rgba(0, 0, 0, 0.04);
  user-select: none;
`;
const Operating = styled.div`
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
const OperatingBox = styled.div`
  width: 28%;
  display: flex;
  align-items: center;
  margin-left:15%;
  justify-content: space-between;
`;
const PageBox = styled.div`
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const PrintBox = styled.div`
width: 5%;
display: flex;
align-items: center;
justify-content: space-between;
`;
const PreviewWrapper = styled.div`
  flex-shrink: 0;
  flex-grow: 0;
  width: 240px;
  height: 100%;
  background: #fff;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  box-shadow: 2px 0 8px 0 rgba(0,0,0,0.15);
  display: ${props => (props.showPreview ? 'flex' : 'none')};
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
  const wrapper = useRef();
  const [showPreview, setShowPreview] = useState(true);
  useEffect(() => {
    emitter.addListener('isShow', () => {
      setShowPreview(!showPreview);
    });
  });
  return (
    <Wrapper ref={wrapper}>
      <Operating>
        <BackButton isTextButton />
        <OperatingBox>
          <Deformation />
          <Reset />
          <PageBox>
            <PrevAndNext iconType="left" />
            <PageTurning />
            <PrevAndNext />
          </PageBox>
          <Rotate />
          <Rotate degree={0} />
        </OperatingBox>
        <PrintBox >
        <Icon type="download"onClick={() => forceFileDownload(pdf.url, pdf.url)}/>
        <Print />
        </PrintBox >
      </Operating>
      <PDFViewerWrapper>
        <PreviewWrapper showPreview>
          <Preview
            onError={console.error} // eslint-disable-line
            url={pdf.url}
          />
        </PreviewWrapper>
        <PDFViewer
          onError={console.error} // eslint-disable-line
          url={pdf.url}
          pdfData={pdf}
          download={() => forceFileDownload(pdf.url, pdf.url)}
          wrapper={wrapper}
        />
      </PDFViewerWrapper>
    </Wrapper>
  );
};

export default App;
export {
  PDFViewer,
  forceFileDownload,
  Preview,
  Deformation,
  PageTurning,
  PrevAndNext,
  Print,
  Rotate,
  BackButton,
  Reset,
};

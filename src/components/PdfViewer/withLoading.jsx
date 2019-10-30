/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
// import { FormattedMessage } from 'react-intl';
import { Spin } from 'antd';

const LoadingWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 81%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const LoadingHint = styled.span`
  margin-top: 32px;
  margin-bottom: 24px;
  font-size: 14px;
  color: #fff;
`;
const LoadingWithHint = ({ showHint = false }) => (
  <LoadingWrapper>
    {showHint && (
      <>
        <Spin size="large" />
        <LoadingHint>
          {/* <FormattedMessage
            id="components.PdfViewer.withLoading"
            defaultMessage="components.PdfViewer.withLoading"
          /> */}
        </LoadingHint>
      </>
    )}
  </LoadingWrapper>
);

const Container = styled.div`
  width: 100%;
  height: 100%;
`;
const PreviewWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: ${p => (p.hidden ? 'none' : 'flex')};
`;

const WAIT_TIME = 8000;

const withLoading = BaseComponent => class WithLoading extends React.Component {
    timer = null;

    state = {
      loading: true,
      showHint: true,
    };

    componentWillUnmount() {
      this.stopTimer();
    }

    stopTimer = () => {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    };

    startTimer = () => {
      this.stopTimer();
      this.timer = setTimeout(() => {
        this.setState({
          showHint: true,
        });
      }, WAIT_TIME);
    };

    setLoading = (showLoading) => {
      if (showLoading) {
        this.startTimer();
      } else {
        this.stopTimer();
        this.setState({ showHint: false });
      }
      this.setState({ loading: !!showLoading });
    };

    render() {
      const { onOpen } = this.props;
      const { loading, showHint } = this.state;
      return (
        <Container>
          {loading && <LoadingWithHint showHint={showHint} onOpen={onOpen} />}
          <PreviewWrapper hidden={loading}>
            <BaseComponent {...this.props} loading={loading} setLoading={this.setLoading} />
          </PreviewWrapper>
        </Container>
      );
    }
    // eslint-disable-next-line indent
  };

export default withLoading;

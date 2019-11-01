import React, { Component } from 'react';
import { Icon } from 'antd';
import emitter from 'ev';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
`;
const Number = styled.span`
  display: block;
  min-width: 3em;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  text-align: center;
  user-select: none;
  &::after {
    content: '%';
  }
`;

const ZOOM_MAX = 300;
const ZOOM_MIN = 20;
const ZOOM_STEP = 10;
export default class Deformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pdfViewer: null,
      scaleValue: 120,
    };
  }

  componentDidMount() {
    this.eventEmitter = emitter.addListener('callMe', (msg) => {
      this.setState({
        pdfViewer: msg,
      });
    });
    this.eventEmitterScale = emitter.addListener('scaleValue', (msg) => {
      this.setState({
        scaleValue: msg,
      });
    });
  }

  // 组件销毁前移除事件监听
  componentWillUnmount() {
    emitter.removeListener(this.eventEmitter);
    emitter.removeListener(this.eventEmitterScale);
  }

  onRotate = (deg) => {
    const { pdfViewer } = this.state;
    pdfViewer.rotate(deg);
  };

  zoomStep = (step) => {
    const { scaleValue, pdfViewer } = this.state;
    const diff = scaleValue % ZOOM_STEP;
    // eslint-disable-next-line no-nested-ternary
    const data = diff ? (step > 0 ? ZOOM_STEP - diff : -diff) : step;
    pdfViewer.scale((scaleValue + data) / 100);
  };

  onZoomIn = () => {
    const { scaleValue } = this.state;
    if (scaleValue < ZOOM_MAX) {
      this.zoomStep(+ZOOM_STEP);
    }
  };

  onZoomOut = () => {
    const { scaleValue } = this.state;
    if (scaleValue > ZOOM_MIN) {
      this.zoomStep(-ZOOM_STEP);
    }
  };

  render() {
    const { scaleValue } = this.state;
    return <Container>
    <Icon
      type="zoom-out"
      pl={12}
      pr={8}
      disabled={scaleValue <= ZOOM_MIN}
      onClick={scaleValue <= ZOOM_MIN ? null : this.onZoomOut}
    />
    <Number>{scaleValue}</Number>
    <Icon
      type="zoom-in"
      pl={8}
      pr={12}
      disabled={scaleValue >= ZOOM_MAX}
      onClick={scaleValue >= ZOOM_MAX ? null : this.onZoomIn}
    />
  </Container>;
  }
}

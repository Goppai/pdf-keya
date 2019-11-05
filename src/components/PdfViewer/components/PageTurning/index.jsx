/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import styled from 'styled-components';
import emitter from 'ev';

const Container = styled.div`
  display: flex;
  align-items: center;
  min-width:60px;
`;
const Input = styled.input`
  border: none;
  outline: none;
  height: 22px;
  width: 26px;
  border-radius: 2px;
  text-align: center;
  background: rgba(0, 0, 0, 0.15);
  &&::-webkit-outer-spin-button,
  &&::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`;
const Text = styled.span`
  margin-left: 4px;
  user-select: none;
`;

export default class PageTurning extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pdfViewer: null,
      currentPage: 1,
      totalPage: 0,
    };
  }

  componentDidMount() {
    this.eventEmitter = emitter.addListener('callMe', (msg) => {
      this.setState({
        pdfViewer: msg,
      });
    });
    this.eventCurrentPage = emitter.addListener('currentPage', (msg) => {
      this.setState({
        currentPage: msg,
      });
    });
    this.evenTotalPage = emitter.addListener('totalPage', (msg) => {
      this.setState({
        totalPage: msg,
      });
    });
  }

  // 组件销毁前移除事件监听
  componentWillUnmount() {
    emitter.removeListener(this.eventEmitter);
    emitter.removeListener(this.eventCurrentPage);
    emitter.removeListener(this.evenTotalPage);
  }

  onValueChange = (evt) => {
    this.setState({ currentPage: evt.target.value });
  };

  onKeyDown = (evt) => {
    if (evt.key === 'Enter') {
      const { pdfViewer } = this.state;
      pdfViewer.setPage(parseInt(evt.target.value, 10));
    }
  };


  render() {
    const {
      totalPage, currentPage,
    } = this.state;
    return <Container>
    <Input type="number" onChange={this.onValueChange} onKeyDown={this.onKeyDown} value={currentPage} />
    <Text>/ {totalPage}</Text>
  </Container>;
  }
}
PageTurning.defaultProps = {

};
PageTurning.propTypes = {

};

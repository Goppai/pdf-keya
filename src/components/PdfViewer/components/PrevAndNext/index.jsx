/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import emitter from 'ev';

export default class PrevAndNext extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pdfViewer: null,
      currentPage: 1,
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
  }

  componentWillUnmount() {
    emitter.removeListener(this.eventEmitter);
    emitter.removeListener(this.eventCurrentPage);
  }

  onPrevAndNext = (page) => {
    const { pdfViewer, currentPage } = this.state;
    pdfViewer.setPage(currentPage + page);
  };

  render() {
    const { iconType, icon, page } = this.props;

    return icon
      ? <Icon component={icon} onClick={() => this.onPrevAndNext(page)} />
      : <Icon type={iconType} onClick={() => this.onPrevAndNext(page)} />;
  }
}
PrevAndNext.defaultProps = {
  page: 1,
  icon: null,
  iconType: 'right',
};
PrevAndNext.propTypes = {
  page: PropTypes.number,
  icon: PropTypes.element,
  iconType: PropTypes.string,
};

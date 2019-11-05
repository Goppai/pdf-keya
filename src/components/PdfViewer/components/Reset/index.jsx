/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import emitter from 'ev';

export default class Reset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pdfViewer: null,
    };
  }

  componentDidMount() {
    this.eventEmitter = emitter.addListener('callMe', (msg) => {
      this.setState({
        pdfViewer: msg,
      });
    });
  }

  componentWillUnmount() {
    emitter.removeListener(this.eventEmitter);
  }

  onReset = () => {
    const { pdfViewer } = this.state;
    pdfViewer.pdfViewer.pagesRotation = 0;
    let proportion = window.innerWidth / window.screen.width;
    if (window.innerWidth < 1280) proportion = 1280;
    this.controller.scale(proportion - 0.05);
  };

  render() {
    const { iconType, icon } = this.props;

    return iconType === ''
      ? <Icon component={icon} onClick={this.onReset} />
      : <Icon type={iconType} onClick={this.onReset} />;
  }
}
Reset.defaultProps = {
  icon: null,
  iconType: 'redo',
};
Reset.propTypes = {
  icon: PropTypes.element,
  iconType: PropTypes.string,
};

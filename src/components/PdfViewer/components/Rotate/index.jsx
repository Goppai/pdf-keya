/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import emitter from 'ev';
import RotateLeft from 'components/PdfViewer/components/svgjsx/Turnleft';

export default class Rotate extends Component {
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

  onRotate = (deg) => {
    const { pdfViewer } = this.state;
    pdfViewer.rotate(deg);
  };

  render() {
    const { iconType, icon, degree } = this.props;
    // {iconType:antd的icon组件传递的图标type,
    // icon:自己的svg文件通过component展示,
    // degree:这个是旋转功能的度数默认为90}
    return iconType === ''
      ? <Icon component={icon} onClick={() => this.onRotate(degree)} />
      : <Icon type={iconType} onClick={() => this.onRotate(degree)} />;
  }
}
Rotate.defaultProps = {
  degree: 90,
  icon: RotateLeft,
  iconType: '',
};
Rotate.propTypes = {
  degree: PropTypes.number,
  icon: PropTypes.element,
  iconType: PropTypes.string,
};

// import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
// import { Icon } from 'antd';
// import emitter from 'ev';
// import RotateLeft from '../svgjsx/Turnleft';

// const Rotate = ({ degree, icon, iconType }) => {
//   const [pdfViewer, setPdfViewer] = useState();
//   useEffect(() => {
//     const eventEmitter = emitter.addListener('callMe', (msg) => {
//       setPdfViewer(msg);
//     });
//     return () => { emitter.removeListener(eventEmitter); };
//   }, []);
//   const onRotate = (deg) => {
//     pdfViewer.rotate(deg);
//   };
//   return iconType === ''
//     ? <Icon component={icon} onClick={() => onRotate(degree)} />
//     : <Icon type={iconType} onClick={() => onRotate(degree)} />;
// };
// Rotate.defaultProps = {
//   degree: 90,
//   icon: RotateLeft,
//   iconType: '',
// };
// Rotate.propTypes = {
//   degree: PropTypes.number,
//   icon: PropTypes.element,
//   iconType: PropTypes.string,
// };
// export default Rotate;

// Hooks版本的代码 因为events未能监听的情况未解决 暂时封存 后面解决了会采用hooks版本

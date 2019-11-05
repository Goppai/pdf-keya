"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("antd/lib/icon/style/css");

var _icon = _interopRequireDefault(require("antd/lib/icon"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _ev = _interopRequireDefault(require("../../../../ev"));

var _Turnleft = _interopRequireDefault(require("../svgjsx/Turnleft"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable react/destructuring-assignment */
class Rotate extends _react.Component {
  constructor(props) {
    super(props);

    this.onRotate = deg => {
      const {
        pdfViewer
      } = this.state;
      pdfViewer.rotate(deg);
    };

    this.state = {
      pdfViewer: null
    };
  }

  componentDidMount() {
    this.eventEmitter = _ev.default.addListener('callMe', msg => {
      this.setState({
        pdfViewer: msg
      });
    });
  }

  componentWillUnmount() {
    _ev.default.removeListener(this.eventEmitter);
  }

  render() {
    const {
      iconType,
      icon,
      degree
    } = this.props; // {iconType:antd的icon组件传递的图标type,
    // icon:自己的svg文件通过component展示,
    // degree:这个是旋转功能的度数默认为90}

    return iconType === '' ? _react.default.createElement(_icon.default, {
      component: icon,
      onClick: () => this.onRotate(degree)
    }) : _react.default.createElement(_icon.default, {
      type: iconType,
      onClick: () => this.onRotate(degree)
    });
  }

}

exports.default = Rotate;
Rotate.defaultProps = {
  degree: 90,
  icon: _Turnleft.default,
  iconType: ''
};
Rotate.propTypes = {
  degree: _propTypes.default.number,
  icon: _propTypes.default.element,
  iconType: _propTypes.default.string
}; // import React, { useEffect, useState } from 'react';
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
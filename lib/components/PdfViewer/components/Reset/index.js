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

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable react/destructuring-assignment */
class Reset extends _react.Component {
  constructor(props) {
    super(props);

    this.onReset = () => {
      const {
        pdfViewer
      } = this.state;
      pdfViewer.pdfViewer.pagesRotation = 0;
      let proportion = window.innerWidth / window.screen.width;
      if (window.innerWidth < 1280) proportion = 1280;
      this.controller.scale(proportion - 0.05);
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
      icon
    } = this.props;
    return iconType === '' ? _react.default.createElement(_icon.default, {
      component: icon,
      onClick: this.onReset
    }) : _react.default.createElement(_icon.default, {
      type: iconType,
      onClick: this.onReset
    });
  }

}

exports.default = Reset;
Reset.defaultProps = {
  icon: null,
  iconType: 'redo'
};
Reset.propTypes = {
  icon: _propTypes.default.element,
  iconType: _propTypes.default.string
};
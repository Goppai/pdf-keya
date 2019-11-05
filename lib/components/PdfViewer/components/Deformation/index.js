"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("antd/lib/icon/style/css");

var _icon = _interopRequireDefault(require("antd/lib/icon"));

var _react = _interopRequireWildcard(require("react"));

var _ev = _interopRequireDefault(require("../../../../ev"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Container = _styledComponents.default.div`
  display: flex;
  align-items: center;
`;
const Number = _styledComponents.default.span`
  display: block;
  text-align: center;
  user-select: none;
  margin:0px 10px;
  &::after {
    content: '%';
  }
`;
const ZOOM_MAX = 300;
const ZOOM_MIN = 20;
const ZOOM_STEP = 10;

class Deformation extends _react.Component {
  constructor(props) {
    super(props);

    this.onRotate = deg => {
      const {
        pdfViewer
      } = this.state;
      pdfViewer.rotate(deg);
    };

    this.zoomStep = step => {
      const {
        scaleValue,
        pdfViewer
      } = this.state;
      const diff = scaleValue % ZOOM_STEP; // eslint-disable-next-line no-nested-ternary

      const data = diff ? step > 0 ? ZOOM_STEP - diff : -diff : step;
      pdfViewer.scale((scaleValue + data) / 100);
    };

    this.onZoomIn = () => {
      const {
        scaleValue
      } = this.state;

      if (scaleValue < ZOOM_MAX) {
        this.zoomStep(+ZOOM_STEP);
      }
    };

    this.onZoomOut = () => {
      const {
        scaleValue
      } = this.state;

      if (scaleValue > ZOOM_MIN) {
        this.zoomStep(-ZOOM_STEP);
      }
    };

    this.state = {
      pdfViewer: null,
      scaleValue: 120
    };
  }

  componentDidMount() {
    this.eventEmitter = _ev.default.addListener('callMe', msg => {
      this.setState({
        pdfViewer: msg
      });
    });
    this.eventEmitterScale = _ev.default.addListener('scaleValue', msg => {
      this.setState({
        scaleValue: msg
      });
    });
  } // 组件销毁前移除事件监听


  componentWillUnmount() {
    _ev.default.removeListener(this.eventEmitter);

    _ev.default.removeListener(this.eventEmitterScale);
  }

  render() {
    const {
      scaleValue
    } = this.state;
    return _react.default.createElement(Container, null, _react.default.createElement(_icon.default, {
      type: "zoom-out",
      pl: 12,
      pr: 8,
      disabled: scaleValue <= ZOOM_MIN,
      onClick: scaleValue <= ZOOM_MIN ? null : this.onZoomOut
    }), _react.default.createElement(Number, null, scaleValue), _react.default.createElement(_icon.default, {
      type: "zoom-in",
      pl: 8,
      pr: 12,
      disabled: scaleValue >= ZOOM_MAX,
      onClick: scaleValue >= ZOOM_MAX ? null : this.onZoomIn
    }));
  }

}

exports.default = Deformation;
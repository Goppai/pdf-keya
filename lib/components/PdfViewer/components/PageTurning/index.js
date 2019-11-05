"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _ev = _interopRequireDefault(require("../../../../ev"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/* eslint-disable react/destructuring-assignment */
const Container = _styledComponents.default.div`
  display: flex;
  align-items: center;
  min-width:60px;
`;
const Input = _styledComponents.default.input`
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
const Text = _styledComponents.default.span`
  margin-left: 4px;
  user-select: none;
`;

class PageTurning extends _react.Component {
  constructor(props) {
    super(props);

    this.onValueChange = evt => {
      this.setState({
        currentPage: evt.target.value
      });
    };

    this.onKeyDown = evt => {
      if (evt.key === 'Enter') {
        const {
          pdfViewer
        } = this.state;
        pdfViewer.setPage(parseInt(evt.target.value, 10));
      }
    };

    this.state = {
      pdfViewer: null,
      currentPage: 1,
      totalPage: 0
    };
  }

  componentDidMount() {
    this.eventEmitter = _ev.default.addListener('callMe', msg => {
      this.setState({
        pdfViewer: msg
      });
    });
    this.eventCurrentPage = _ev.default.addListener('currentPage', msg => {
      this.setState({
        currentPage: msg
      });
    });
    this.evenTotalPage = _ev.default.addListener('totalPage', msg => {
      this.setState({
        totalPage: msg
      });
    });
  } // 组件销毁前移除事件监听


  componentWillUnmount() {
    _ev.default.removeListener(this.eventEmitter);

    _ev.default.removeListener(this.eventCurrentPage);

    _ev.default.removeListener(this.evenTotalPage);
  }

  render() {
    const {
      totalPage,
      currentPage
    } = this.state;
    return _react.default.createElement(Container, null, _react.default.createElement(Input, {
      type: "number",
      onChange: this.onValueChange,
      onKeyDown: this.onKeyDown,
      value: currentPage
    }), _react.default.createElement(Text, null, "/ ", totalPage));
  }

}

exports.default = PageTurning;
PageTurning.defaultProps = {};
PageTurning.propTypes = {};
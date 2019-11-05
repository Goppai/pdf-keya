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
class PrevAndNext extends _react.Component {
  constructor(props) {
    super(props);

    this.onPrevAndNext = page => {
      const {
        pdfViewer,
        currentPage
      } = this.state;
      pdfViewer.setPage(currentPage + page);
    };

    this.state = {
      pdfViewer: null,
      currentPage: 1
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
  }

  componentWillUnmount() {
    _ev.default.removeListener(this.eventEmitter);

    _ev.default.removeListener(this.eventCurrentPage);
  }

  render() {
    const {
      iconType,
      icon,
      page
    } = this.props;
    return icon ? _react.default.createElement(_icon.default, {
      component: icon,
      onClick: () => this.onPrevAndNext(page)
    }) : _react.default.createElement(_icon.default, {
      type: iconType,
      onClick: () => this.onPrevAndNext(page)
    });
  }

}

exports.default = PrevAndNext;
PrevAndNext.defaultProps = {
  page: 1,
  icon: null,
  iconType: 'right'
};
PrevAndNext.propTypes = {
  page: _propTypes.default.number,
  icon: _propTypes.default.element,
  iconType: _propTypes.default.string
};
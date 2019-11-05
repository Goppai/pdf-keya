"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("antd/lib/spin/style/css");

var _spin = _interopRequireDefault(require("antd/lib/spin"));

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const LoadingWrapper = _styledComponents.default.div`
  position: absolute;
  top: 50%;
  left: 81%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const LoadingHint = _styledComponents.default.span`
  margin-top: 32px;
  margin-bottom: 24px;
  font-size: 14px;
  color: #fff;
`;

const LoadingWithHint = ({
  showHint = false
}) => _react.default.createElement(LoadingWrapper, null, showHint && _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_spin.default, {
  size: "large"
}), _react.default.createElement(LoadingHint, null)));

const Container = _styledComponents.default.div`
  width: 100%;
  height: 100%;
`;
const PreviewWrapper = _styledComponents.default.div`
  width: 100%;
  height: 100%;
  display: ${p => p.hidden ? 'none' : 'flex'};
`;
const WAIT_TIME = 8000;

const withLoading = BaseComponent => {
  var _temp;

  return _temp = class WithLoading extends _react.default.Component {
    constructor(...args) {
      super(...args);
      this.timer = null;
      this.state = {
        loading: true,
        showHint: true
      };

      this.stopTimer = () => {
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
      };

      this.startTimer = () => {
        this.stopTimer();
        this.timer = setTimeout(() => {
          this.setState({
            showHint: true
          });
        }, WAIT_TIME);
      };

      this.setLoading = showLoading => {
        if (showLoading) {
          this.startTimer();
        } else {
          this.stopTimer();
          this.setState({
            showHint: false
          });
        }

        this.setState({
          loading: !!showLoading
        });
      };
    }

    componentWillUnmount() {
      this.stopTimer();
    }

    render() {
      const {
        onOpen
      } = this.props;
      const {
        loading,
        showHint
      } = this.state;
      return _react.default.createElement(Container, null, loading && _react.default.createElement(LoadingWithHint, {
        showHint: showHint,
        onOpen: onOpen
      }), _react.default.createElement(PreviewWrapper, {
        hidden: loading
      }, _react.default.createElement(BaseComponent, _extends({}, this.props, {
        loading: loading,
        setLoading: this.setLoading
      }))));
    } // eslint-disable-next-line indent


  }, _temp;
};

var _default = withLoading;
exports.default = _default;
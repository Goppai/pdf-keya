"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

function useAsyncEffect(effect, dependencies) {
  const [data, setData] = (0, _react.useState)(null);
  const [error, setError] = (0, _react.useState)(null);
  (0, _react.useEffect)(() => {
    (async () => {
      try {
        const res = await effect(...dependencies);
        setData(res);
      } catch (e) {
        console.error(e); // eslint-disable-line

        setError(e);
      }
    })();
  }, dependencies); // eslint-disable-line

  return {
    data,
    error
  };
}

var _default = useAsyncEffect;
exports.default = _default;
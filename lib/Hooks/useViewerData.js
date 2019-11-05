"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

var _client = require("seal-client/client");

var _useQueryFiles = _interopRequireDefault(require("./useQueryFiles"));

var _useDownloadFile = _interopRequireDefault(require("./useDownloadFile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function useViewerData(selectedFileID) {
  const stackClient = (0, _react.useContext)(_client.ClientContext);
  const linkData = (0, _useQueryFiles.default)(stackClient, selectedFileID);
  const fileData = (0, _useDownloadFile.default)(stackClient, linkData.data);
  return {
    error: linkData.error || fileData.error,
    data: { ...fileData.data
    }
  };
}

var _default = useViewerData;
exports.default = _default;
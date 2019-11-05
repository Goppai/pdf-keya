"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const forceFileDownload = async (filename, href) => {
  const element = document.createElement('a');
  element.setAttribute('href', `${href}?Dl=1&user=1`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

var _default = forceFileDownload;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBackUrl = void 0;
const {
  search
} = window.location;
const fromPreviewMatchResult = search.match(/from=([^&?#]+)&?#?/);
const backUrl = fromPreviewMatchResult && decodeURIComponent(fromPreviewMatchResult[1]);

const getBackUrl = () => backUrl;

exports.getBackUrl = getBackUrl;
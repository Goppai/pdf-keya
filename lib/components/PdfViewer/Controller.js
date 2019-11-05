"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pdf_viewer = require("pdfjs-dist/web/pdf_viewer");

var _dom_events = require("pdfjs-dist/lib/web/dom_events");

var _pdf_link_service = require("pdfjs-dist/lib/web/pdf_link_service");

/* eslint-disable class-methods-use-this */

/* eslint-disable no-underscore-dangle */
class HackPDFViewer extends _pdf_viewer.PDFViewer {
  _scrollIntoView({
    pageDiv
  }) {
    pageDiv.scrollIntoView();
  }

}
/*
  externalLinkTarget: Controls how external links will be opened.
  0 = default.
  1 = replaces current window.
  2 = new window/tab.
  3 = parent.
  4 = in top window.
*/


class Controller {
  constructor(container) {
    this.eventBus = (0, _dom_events.getGlobalEventBus)();
    this.pdfLinkService = new _pdf_link_service.PDFLinkService({
      eventBus: this.eventBus,
      externalLinkTarget: 2,
      externalLinkRel: 'noopener noreferrer nofollow'
    });
    this.pdfViewer = new HackPDFViewer({
      container,
      eventBus: this.eventBus,
      linkService: this.pdfLinkService
    });
    this.pdfLinkService.setViewer(this.pdfViewer);
  }

  loadDoc(doc) {
    this.doc = doc;
    this.pdfViewer.setDocument(doc); // eslint-disable-next-line no-restricted-globals

    this.pdfLinkService.setDocument(doc, location.href.split('#')[0]);
  }

  setPage(page) {
    if (Number.isNaN(+page) || page < 1 || page > this.doc.numPages || !Number.isInteger(page)) {
      console.warn('incorrect page', page); // eslint-disable-line

      return;
    }

    this.pdfViewer.currentPageLabel = page;
  }

  rotate(delta) {
    const newRotation = (this.pdfViewer.pagesRotation + 360 + delta) % 360;
    this.pdfViewer.pagesRotation = newRotation;
  }

  scale(ratio) {
    this.pdfViewer.currentScaleValue = ratio;
  }

}

var _default = Controller;
exports.default = _default;
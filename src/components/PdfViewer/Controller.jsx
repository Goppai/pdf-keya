/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import { PDFViewer } from 'pdfjs-dist/web/pdf_viewer';
import { getGlobalEventBus } from 'pdfjs-dist/lib/web/dom_events';
import { PDFLinkService } from 'pdfjs-dist/lib/web/pdf_link_service';

class HackPDFViewer extends PDFViewer {
  _scrollIntoView({ pageDiv }) {
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
    this.eventBus = getGlobalEventBus();
    this.pdfLinkService = new PDFLinkService({
      eventBus: this.eventBus,
      externalLinkTarget: 2,
      externalLinkRel: 'noopener noreferrer nofollow',
    });
    this.pdfViewer = new HackPDFViewer({
      container,
      eventBus: this.eventBus,
      linkService: this.pdfLinkService,
    });
    this.pdfLinkService.setViewer(this.pdfViewer);
  }

  loadDoc(doc) {
    this.doc = doc;
    this.pdfViewer.setDocument(doc);
    // eslint-disable-next-line no-restricted-globals
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

export default Controller;

import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

const Print = ({ pdfData, url }) => {
  const iframeRef = useRef();
  const print = () => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.send('print', url);
    } else {
      const iframe = iframeRef.current;

      const URL = window.URL || window.webkitURL;
      const blob = new Blob([pdfData], { type: 'application/pdf' });
      const objectURL = URL.createObjectURL(blob);

      iframe.src = objectURL;
      iframe.onload = () => {
        URL.revokeObjectURL(objectURL);
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      };
    }
  };

  return <><Icon type="printer" onClick={print} />
  <iframe ref={iframeRef} title={Math.random()} style={{ display: 'none' }} /></>;
};

Print.propTypes = {
  url: PropTypes.string.isRequired,
  pdfData: PropTypes.instanceOf(Object).isRequired,
};

export default Print;

import { useContext } from 'react';

import { ClientContext } from 'seal-client/client';

import useQueryLinks from './useQueryFiles';
import useDownloadFile from './useDownloadFile';

function useViewerData(selectedFileID) {
  const stackClient = useContext(ClientContext);

  const linkData = useQueryLinks(stackClient, selectedFileID);
  const fileData = useDownloadFile(stackClient, linkData.data);

  return {
    error: linkData.error || fileData.error,
    data: {
      ...fileData.data,
    },
  };
}

export default useViewerData;

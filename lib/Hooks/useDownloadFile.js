"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _useAsyncEffect = _interopRequireDefault(require("./useAsyncEffect"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function useDownloadFile(stackClient, downloadFiles) {
  const fileData = (0, _useAsyncEffect.default)(async () => {
    if (!downloadFiles) return null;
    const stackFile = stackClient.collection('keyayun.seal.files');

    const getDownloadLink = file => stackFile.getDownloadLinkById(file.id);

    const fetchFile = (file, type) => getDownloadLink(file).then(link => link.replace(stackClient.uri, '')).then(path => stackClient.fetch('GET', path)).then(res => res[type]());

    const {
      plyFile,
      cprFile,
      vtpFiles,
      pdfFile
    } = downloadFiles;
    const [plyData, cprData, vtpData, pdfData] = await Promise.all([fetchFile(plyFile, 'text'), cprFile ? fetchFile(cprFile, 'arrayBuffer') : Promise.resolve(), Promise.all(vtpFiles.map(vtpFile => fetchFile(vtpFile, 'text'))), pdfFile ? fetchFile(pdfFile, 'arrayBuffer') : Promise.resolve()]);
    if (pdfFile) pdfData.url = await getDownloadLink(pdfFile);
    return {
      ply: plyData,
      cpr: cprData,
      vtps: vtpData,
      pdf: pdfData
    };
  }, [downloadFiles]);
  return fileData;
}

var _default = useDownloadFile;
exports.default = _default;
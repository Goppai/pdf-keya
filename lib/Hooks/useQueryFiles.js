"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _useAsyncEffect = _interopRequireDefault(require("./useAsyncEffect"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function useQueryFiles(stackClient, selectedFileID) {
  const filesData = (0, _useAsyncEffect.default)(async () => {
    if (!selectedFileID) return null;

    const getJSON = link => stackClient.fetchJSON('GET', link);

    const {
      data: selectedFile
    } = await getJSON(`/files/${selectedFileID}`);
    const {
      name
    } = selectedFile.attributes;
    const parentLink = selectedFile.relationships.parent.links.related;
    let fileList = [];

    const findDir = (entries, dirName) => entries.filter(({
      attributes: attrs
    }) => attrs.type === 'directory').find(({
      attributes: attrs
    }) => attrs.name === dirName);

    const getChildren = dir => dir ? getJSON(dir.links.self).then(r => r.included || []) : Promise.resolve([]); // eslint-disable-line


    const getFileList = async (caseRootChildren = []) => {
      // 从 case 根目录查找
      const dirs = ['model', 'tmp'].map(dirName => findDir(caseRootChildren, dirName));
      const [modelChildren, tmpChildren] = await Promise.all(dirs.map(getChildren));
      return [...caseRootChildren, ...modelChildren, ...tmpChildren].filter(Boolean).filter(file => file.attributes.type === 'file');
    };

    if (name.endsWith('_aorta+both.ply')) {
      // 选取的是ply文件： 当前文件夹 + model文件夹 + tmp文件夹
      const caseIncluded = await getJSON(parentLink).then(res => res.included).then(included => included.filter(Boolean));
      fileList = await getFileList(caseIncluded);
    } else if (name.endsWith('_cl_1Dmesh.vtp')) {
      const {
        included,
        data
      } = await getJSON(parentLink);

      if (data.attributes.name === 'model') {
        // 选取的是model文件夹下的vtp文件： 当前文件夹 + model文件夹 + tmp文件夹
        const {
          included: caseRootChildren
        } = await getJSON(data.relationships.parent.links.self);
        const tmpDir = findDir(caseRootChildren, 'tmp');
        const tmpChildren = await getChildren(tmpDir);
        fileList = [...caseRootChildren, ...included, ...tmpChildren].filter(Boolean).filter(file => file.attributes.type === 'file');
      } else {
        // 选取的是case文件夹下的vtp文件： 当前文件夹 + model文件夹 + tmp文件夹
        fileList = await getFileList(included);
      }
    } else {
      throw new Error('Not support file type！');
    }

    const [pdfFile] = [fileList.find(file => file.attributes.name.endsWith('.pdf'))];
    return {
      pdfFile
    };
  }, [selectedFileID]);
  return filesData;
}

var _default = useQueryFiles;
exports.default = _default;
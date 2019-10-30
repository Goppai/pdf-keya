const forceFileDownload = async (filename, href) => {
  const element = document.createElement('a');
  element.setAttribute('href', `${href}?Dl=1&user=1`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
export default forceFileDownload;

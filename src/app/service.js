// eslint-disable-next-line no-unused-vars
const test = (client, options) => {
  const dataAPI = `/v1/data`;
  const docType = 'keyayun.service.test';
  const payload = [
    {
      type: docType,
      attributes: { test: 'test1' },
    },
  ];
  const path = `${dataAPI}/${docType}/create`;
  client.fetchJSON('POST', path, { data: payload });
};

export default test;

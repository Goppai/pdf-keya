import { ClientDef } from 'seal-client/client';

const test = (client: ClientDef, options: object) => {
  console.log(options); // eslint-disable-line no-console
  const dataAPI = '/v1/data';
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

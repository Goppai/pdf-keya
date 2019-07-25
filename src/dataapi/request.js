import _ from 'lodash';

const encodeQueryData = (data) => {
  if (data == null) return '';
  const ret = [];
  _.forEach(data, (v, k) => {
    ret.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
  });
  if (ret.length === 0) {
    return '';
  }
  return `?${ret.join('&')}`;
};

const makeCreateURL = ({ doctype }) => `/v1/data/${doctype}/create`;
const makeGetURL = ({ doctype, docid }) => `/v1/data/${doctype}/${docid}`;
const makeDeleteURL = ({ doctype, docid, rev }) => `/v1/data/${doctype}/${docid}${encodeQueryData({ rev })}`;
const makePutURL = ({ doctype, docid }) => `/v1/data/${doctype}/${docid}`;

const create = ({ client, doctype, attributes }) => client
  .fetchJSON('POST', makeCreateURL({ doctype }), {
    data: [
      {
        type: doctype,
        attributes,
      },
    ],
  })
  .then(json => json.data[0]);

const get = ({ client, doctype, docid }) => client.fetchJSON('GET', makeGetURL({ doctype, docid })).then(json => json.data[0]);

const doRemove = ({
  client, doctype, docid, rev,
}) => client.fetchJSON('DELETE', makeDeleteURL({ doctype, docid, rev })).then(() => true);

const doPut = ({
  client, doctype, docid, attributes, rev,
}) => {
  const data = {
    data: [
      {
        id: docid,
        type: doctype,
        attributes,
        meta: {
          rev,
        },
      },
    ],
  };
  return client.fetchJSON('PUT', makePutURL({ doctype, docid }), data).then(json => json.data[0]);
};

const modifyWithRev = async (params, modifyFN) => {
  const { force, rev, ...otherParams } = params;
  if (force) {
    try {
      if (!rev) {
        throw Object({ code: 409 });
      } else {
        return await modifyFN({ ...otherParams, rev });
      }
    } catch (e) {
      if (
        e.code === 409
        || e.message === '{"error":"revision conflict"}'
        || e.message
          === '{"error":"key already exists, if a cas was provided the key exists with a different cas"}'
      ) {
        const doc = await get(otherParams);
        return modifyFN({ ...otherParams, rev: doc.meta.rev });
      }
      throw e;
    }
  } else if (!rev) {
    throw new Error('please provide rev of doc or set force = true');
  } else {
    return modifyFN({ ...otherParams, rev });
  }
};

const remove = params => modifyWithRev(params, doRemove);
const put = params => modifyWithRev(params, doPut);

export {
  create, get, remove, put,
};

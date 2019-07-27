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
const makeAllURL = ({
  doctype, limit, sortby, skip, descending,
}) => `/v1/data/${doctype}/all${encodeQueryData({
  'page[limit]': limit,
  'page[skip]': skip,
  sortby,
  descending,
})}`;
const makeLinkURL = ({ doctype, id }) => `/v1/references/${doctype}/${id}`;
const makeAllLinksURL = ({
  doctype, id, limit, skip, descending, rdoctype,
}) => `/v1/references/${doctype}/${id}${encodeQueryData({
  doctype: rdoctype,
  'page[limit]': limit,
  'page[skip]': skip,
  descending,
})}`;

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

const jsonToDocs = json => ({
  next: json.links && json.links.next,
  offset: json.meta.offset,
  total: json.meta.total,
  docs: json.data,
});

const all = async ({ client, ...leftParams }) => {
  const json = await client.fetchJSON('GET', makeAllURL(leftParams));
  return jsonToDocs(json);
};

const nextPage = async ({ client, pageUrl }) => {
  const json = await client.fetchJSON('GET', pageUrl);
  return jsonToDocs(json);
};

const linkImpl = async (method, {
  client, rdoctype, rids, ...leftParams
}) => {
  const data = {
    data: rids.map(rid => ({
      type: rdoctype,
      id: rid,
    })),
  };
  const json = await client.fetchJSON(method, makeLinkURL(leftParams), data);
  return json;
};

const link = linkImpl.bind(null, 'POST');
const unlink = linkImpl.bind(null, 'DELETE');

const jsonToLinks = jsonToDocs;

const allLinks = async ({ client, ...leftParams }) => {
  const json = await client.fetchJSON('GET', makeAllLinksURL(leftParams));
  return jsonToLinks(json);
};

const nextLinkPage = nextPage;

export {
  create, get, remove, put, all, nextPage, link, unlink, allLinks, nextLinkPage,
};

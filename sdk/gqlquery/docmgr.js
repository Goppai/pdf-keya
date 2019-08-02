import {
  create,
  get,
  remove,
  put,
  all,
  nextPage,
  link,
  unlink,
  allLinks,
  nextLinkPage,
  find,
  view,
} from './request';

const normDoc = doc => ({
  id: doc.id,
  rev: doc.meta.rev,
  created_at: doc.meta.created_at,
  updated_at: doc.meta.updated_at,
  attributes: doc.attributes,
});

const DocManager = ({
  type, client, dbindex, dbview,
}) => {
  const cachedDocs = {};

  const processDocs = (params, cache = true) => {
    const {
      docs, next, offset, total,
    } = params;
    if (cache) {
      docs.forEach((doc) => {
        cachedDocs[doc.id] = doc;
      });
    }
    return {
      items: docs.map(doc => normDoc(doc)),
      next,
      offset,
      total,
    };
  };
  const processView = (params, viewtype) => {
    const docs = processDocs(params, false);
    docs.items.forEach((item) => {
      // eslint-disable-next-line
      item.internal_viewtype = viewtype;
    });
    return docs;
  };

  return {
    type,
    create: async ({ data }) => {
      const doc = await create({ client, doctype: type, attributes: data });
      cachedDocs[doc.id] = doc;
      return normDoc(doc);
    },
    get: async ({ id }) => {
      const doc = await get({ client, doctype: type, docid: id });
      cachedDocs[doc.id] = doc;
      return normDoc(doc);
    },
    delete: async ({ id, rev, force }) => {
      await remove({
        client,
        doctype: type,
        docid: id,
        rev: rev || (cachedDocs[id] && cachedDocs[id].meta.rev),
        force,
      });
      delete cachedDocs[id];
      return true;
    },
    put: async ({
      id, rev, data, force,
    }) => {
      const doc = await put({
        client,
        doctype: type,
        docid: id,
        rev: rev || (cachedDocs[id] && cachedDocs[id].meta.rev),
        force,
        attributes: data,
      });
      cachedDocs[doc.id] = doc;
      return normDoc(doc);
    },
    all: async (params) => {
      const docs = await all({
        client,
        doctype: type,
        ...params,
      });
      return processDocs(docs);
    },
    nextPage: async (params) => {
      const docs = await nextPage({
        client,
        ...params,
      });
      return processDocs(docs);
    },
    link: async (params) => {
      await link({
        client,
        rdoctype: type,
        ...params,
      });
      return true;
    },
    unlink: async (params) => {
      await unlink({
        client,
        rdoctype: type,
        ...params,
      });
      return true;
    },
    allLinks: async (params) => {
      const docs = await allLinks({
        client,
        rdoctype: type,
        ...params,
      });
      return processDocs(docs);
    },
    nextLinkPage: async (params) => {
      const docs = await nextLinkPage({
        client,
        ...params,
      });
      return processDocs(docs);
    },
    find: async (params) => {
      if (!dbindex) {
        throw new Error('no index is registered. find failed.');
      }
      if (dbindex.indexOf(params.index) === -1) {
        throw new Error(`${params.index} not existed.`);
      }
      const docs = await find({
        client,
        doctype: type,
        ...params,
      });
      return processDocs(docs);
    },
    view: async (params) => {
      if (!dbview) {
        throw new Error('no view is registered. view failed.');
      }
      if (dbview.find(v => v.name === params.view) === undefined) {
        throw new Error(`${params.view} not exisited.`);
      }
      const docs = await view({
        client,
        doctype: type,
        ...params,
      });
      return processView(docs, params.view);
    },
  };
};

export default DocManager;

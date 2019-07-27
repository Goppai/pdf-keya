import {
  create, get, remove, put, all, nextPage,
} from './request';

const normDoc = doc => ({
  id: doc.id,
  rev: doc.meta.rev,
  created_at: doc.meta.created_at,
  updated_at: doc.meta.updated_at,
  attributes: doc.attributes,
});

const DocManager = (type, client) => {
  const cachedDocs = {};

  const processDocs = (params) => {
    const {
      docs, next, offset, total,
    } = params;
    docs.forEach((doc) => {
      cachedDocs[doc.id] = doc;
    });
    return {
      items: docs.map(doc => normDoc(doc)),
      next,
      offset,
      total,
    };
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
    all: async ({
      limit, sortby, skip, descending,
    }) => {
      const docs = await all({
        client,
        doctype: type,
        limit,
        sortby,
        skip,
        descending,
      });
      return processDocs(docs);
    },
    nextPage: async ({ pageUrl }) => {
      const docs = await nextPage({
        client,
        pageUrl,
      });
      return processDocs(docs);
    },
  };
};

export default DocManager;

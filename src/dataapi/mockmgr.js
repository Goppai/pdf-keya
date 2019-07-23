import uuid from 'uuid/v4';
// import _ from 'lodash';

const DocManager = (type) => {
  const database = {};

  return {
    type,
    create: ({ data }) => {
      const id = uuid();
      const rev = uuid();
      const doc = {
        id,
        rev,
        attributes: data,
      };
      database[id] = doc;
      return doc;
    },
    get: ({ id }) => {
      const doc = database[id];
      if (!doc) {
        throw new Error(`doc ${id} is not existed`);
      }
      return doc;
    },
    delete: ({ id, rev }) => {
      const doc = database[id];
      if (!doc) {
        throw new Error(`doc ${id} is not existed`);
      }
      if (doc.rev !== rev) {
        throw new Error('rev is not correct');
      }
      delete doc[id];
      return true;
    },
    put: ({ id, rev, data }) => {
      const doc = database[id];
      if (!doc) {
        throw new Error(`doc ${id} is not existed`);
      }
      if (doc.rev !== rev) {
        throw new Error('rev is not correct');
      }
      doc.attributes = data;
      doc.rev = uuid();
      return doc;
    },
  };
};

export default DocManager;

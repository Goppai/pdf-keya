import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from 'graphql';
import _ from 'lodash';
import DocManager from './_mgr';

const prefixName = (name, prefix) => `${prefix}_${name}`;

const addPrefix = (dataType, prefix) => {
  // eslint-disable-next-line no-param-reassign
  dataType.name = prefixName(dataType.name, prefix);
};

const prefixObject = (o, prefix) => {
  const o2 = {};
  _.forEach(o, (v, k) => {
    o2[prefixName(k, prefix)] = v;
  });
  return o2;
};

const make = (customTypes, prefix) => {
  const { IData, OData } = customTypes;
  addPrefix(IData, prefix);
  addPrefix(OData, prefix);
  const Doc = new GraphQLObjectType({
    name: 'Doc',
    fields: {
      id: { type: GraphQLString },
      rev: { type: GraphQLString },
      attributes: { type: OData },
    },
  });
  addPrefix(Doc, prefix);
  const mutation = {
    create: {
      type: Doc,
      args: {
        data: { type: IData },
      },
    },
    put: {
      type: Doc,
      args: {
        id: { type: GraphQLString },
        rev: { type: GraphQLString },
        data: { type: IData },
      },
    },
    delete: {
      type: GraphQLBoolean,
      args: {
        id: { type: GraphQLString },
        rev: { type: GraphQLString },
      },
    },
  };
  const query = {
    type: { type: GraphQLString },
    get: {
      type: Doc,
      args: {
        id: { type: GraphQLString },
      },
    },
  };
  return { mutation, query };
};

const makeDoc = (type, customTypes, client, prefix) => {
  const mgr = DocManager(type, client);
  const { mutation, query } = make(customTypes, prefix);
  return {
    mutation: prefixObject(mutation, prefix),
    query: prefixObject(query, prefix),
    resolvers: prefixObject(mgr, prefix),
  };
};

export default makeDoc;

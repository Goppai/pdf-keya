import {
  GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLInputObjectType,
} from 'graphql';
import _ from 'lodash';
import MockManager from './mockmgr';
import DocManager from './docmgr';

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
  const IData = new GraphQLInputObjectType({
    name: 'IData',
    fields: customTypes,
  });
  const OData = new GraphQLObjectType({
    name: 'OData',
    fields: customTypes,
  });
  addPrefix(IData, prefix);
  addPrefix(OData, prefix);
  const Doc = new GraphQLObjectType({
    name: 'Doc',
    fields: {
      id: { type: GraphQLString },
      rev: { type: GraphQLString },
      attributes: { type: OData },
      created_at: { type: GraphQLString },
      updated_at: { type: GraphQLString },
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
        force: { type: GraphQLBoolean },
      },
    },
    delete: {
      type: GraphQLBoolean,
      args: {
        id: { type: GraphQLString },
        rev: { type: GraphQLString },
        force: { type: GraphQLBoolean },
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
  // eslint-disable-next-line no-constant-condition
  const mgr = false ? MockManager(type, client) : DocManager(type, client);
  const { mutation, query } = make(customTypes, prefix);
  return {
    mutation: prefixObject(mutation, prefix),
    query: prefixObject(query, prefix),
    resolvers: prefixObject(mgr, prefix),
  };
};

export default makeDoc;

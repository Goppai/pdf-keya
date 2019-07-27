import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
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
      id: { type: GraphQLNonNull(GraphQLString) },
      rev: { type: GraphQLNonNull(GraphQLString) },
      attributes: { type: GraphQLNonNull(OData) },
      created_at: { type: GraphQLString },
      updated_at: { type: GraphQLString },
    },
  });
  const Docs = new GraphQLObjectType({
    name: 'Docs',
    fields: {
      items: { type: GraphQLNonNull(new GraphQLList(Doc)) },
      next: { type: GraphQLString },
      offset: { type: GraphQLInt },
      total: { type: GraphQLInt },
    },
  });
  const Links = new GraphQLObjectType({
    name: 'Links',
    fields: {
      items: { type: GraphQLNonNull(new GraphQLList(Doc)) },
      next: { type: GraphQLString },
      total: { type: GraphQLInt },
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
        id: { type: GraphQLNonNull(GraphQLString) },
        rev: { type: GraphQLString },
        data: { type: GraphQLNonNull(IData) },
        force: { type: GraphQLBoolean },
      },
    },
    delete: {
      type: GraphQLBoolean,
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
        rev: { type: GraphQLString },
        force: { type: GraphQLBoolean },
      },
    },
    link: {
      type: GraphQLBoolean,
      args: {
        doctype: { type: GraphQLNonNull(GraphQLString) },
        id: { type: GraphQLNonNull(GraphQLString) },
        rids: { type: GraphQLNonNull(new GraphQLList(GraphQLString)) },
      },
    },
    unlink: {
      type: GraphQLBoolean,
      args: {
        doctype: { type: GraphQLNonNull(GraphQLString) },
        id: { type: GraphQLNonNull(GraphQLString) },
        rids: { type: GraphQLNonNull(new GraphQLList(GraphQLString)) },
      },
    },
  };
  const query = {
    type: { type: GraphQLString },
    get: {
      type: Doc,
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
      },
    },
    all: {
      type: Docs,
      args: {
        limit: { type: GraphQLInt, defaultValue: 10 },
        sortby: { type: GraphQLString, defaultValue: 'creation' },
        skip: { type: GraphQLInt, defaultValue: 0 },
        descending: { type: GraphQLBoolean, defaultValue: false },
      },
    },
    nextPage: {
      type: Docs,
      args: {
        pageUrl: { type: GraphQLNonNull(GraphQLString) },
      },
    },
    allLinks: {
      type: Links,
      args: {
        id: { type: GraphQLString },
        doctype: { type: GraphQLString },
        limit: { type: GraphQLInt, defaultValue: 10 },
        skip: { type: GraphQLInt, defaultValue: 0 },
        descending: { type: GraphQLBoolean, defaultValue: false },
      },
    },
    nextLinkPage: {
      type: Links,
      args: {
        pageUrl: { type: GraphQLNonNull(GraphQLString) },
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

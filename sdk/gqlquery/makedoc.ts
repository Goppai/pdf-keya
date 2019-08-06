import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLUnionType,
} from 'graphql';
import _ from 'lodash';
import { ClientDef } from 'seal-client/client';
import DocManager from './docmgr';
import { DataAPISchema } from './types';

const prefixName = (name: string, prefix: string): string => `${prefix}_${name}`;

const addPrefix = (dataType: { name: string }, prefix: string): void => {
  // eslint-disable-next-line no-param-reassign
  dataType.name = prefixName(dataType.name, prefix);
};

const prefixObject = (o: { [key: string]: any }, prefix: string) => {
  const o2 = Object();
  _.forEach(o, (v, k) => {
    o2[prefixName(k, prefix)] = v;
  });
  return o2;
};

const viewUnionTypeFrom = (dbview: Array<any>, prefix: string) => {
  const views = Object();
  const types: Array<any> = [];
  dbview.forEach((view) => {
    const viewType = new GraphQLObjectType({
      name: view.name,
      fields: view.types,
    });
    addPrefix(viewType, prefix);
    types.push(viewType);
    views[view.name] = viewType;
  });
  const type = new GraphQLUnionType({
    name: 'ViewUnion',
    types,
    resolveType: value => views[value.internal_viewtype],
  });
  addPrefix(type, prefix);
  return type;
};

const make = (customTypes: any, prefix: string, dbindex?: Array<string>, dbview?: Array<any>) => {
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
  addPrefix(Docs, prefix);
  addPrefix(Links, prefix);
  addPrefix(Doc, prefix);
  const mutation: { [key: string]: any } = {
    create: {
      type: Doc,
      args: {
        data: { type: GraphQLNonNull(IData) },
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
  const query: { [key: string]: any } = {
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
        id: { type: GraphQLNonNull(GraphQLString) },
        doctype: { type: GraphQLNonNull(GraphQLString) },
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
  if (dbindex) {
    query.find = {
      type: Docs,
      args: {
        index: { type: GraphQLNonNull(GraphQLString) },
        selector: { type: GraphQLNonNull(GraphQLString) },
        sort: { type: GraphQLString },
        limit: { type: GraphQLInt, defaultValue: 10 },
        skip: { type: GraphQLInt, defaultValue: 0 },
      },
    };
  }
  if (dbview) {
    const viewType = viewUnionTypeFrom(dbview, prefix);
    const ViewDocs = new GraphQLObjectType({
      name: 'ViewDocs',
      fields: {
        items: { type: GraphQLNonNull(new GraphQLList(viewType)) },
        next: { type: GraphQLString },
      },
    });
    addPrefix(ViewDocs, prefix);
    query.view = {
      type: ViewDocs,
      args: {
        view: { type: GraphQLNonNull(GraphQLString) },
        keys: { type: new GraphQLList(GraphQLString) },
        start_key: { type: GraphQLString },
        end_key: { type: GraphQLString },
        descending: { type: GraphQLBoolean },
        limit: { type: GraphQLInt },
      },
    };
  }
  return { mutation, query };
};

const makeDoc = (
  client: ClientDef,
  {
    type, customTypes, prefix, dbindex, dbview,
  }: DataAPISchema,
) => {
  // eslint-disable-next-line no-constant-condition
  const mgr = DocManager({
    type,
    client,
    dbindex,
    dbview,
  });
  const { mutation, query } = make(customTypes, prefix, dbindex, dbview);
  return {
    mutation: prefixObject(mutation, prefix),
    query: prefixObject(query, prefix),
    resolvers: prefixObject(mgr, prefix),
  };
};

export default makeDoc;

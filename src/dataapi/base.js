const graphql = require('graphql');

const IData = new graphql.GraphQLInputObjectType({
  name: 'IData',
  fields: {
    json: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
  },
});

const OData = new graphql.GraphQLObjectType({
  name: 'OData',
  fields: {
    json: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
  },
});

const Doc = new graphql.GraphQLObjectType({
  name: 'Doc',
  fields: {
    id: { type: graphql.GraphQLString },
    rev: { type: graphql.GraphQLString },
    attributes: { type: OData },
  },
});

// const Docs = new graphql.GraphQLObjectType({
//   name: 'Docs',
//   fields: {
//     items: { type: new graphql.GraphQLList(graphql.GraphQLString) },
//     next: { type: graphql.GraphQLString },
//   },
// });

const Mgr = new graphql.GraphQLObjectType({
  name: 'Mgr',
  fields: {
    type: { type: graphql.GraphQLString },
    create: {
      type: Doc,
      args: {
        data: { type: IData },
      },
    },
    get: {
      type: Doc,
      args: {
        id: { type: graphql.GraphQLString },
      },
    },
    put: {
      type: Doc,
      args: {
        id: { type: graphql.GraphQLString },
        rev: { type: graphql.GraphQLString },
        data: { type: IData },
      },
    },
    delete: {
      type: graphql.GraphQLBoolean,
      args: {
        id: { type: graphql.GraphQLString },
        rev: { type: graphql.GraphQLString },
      },
    },
  },
});

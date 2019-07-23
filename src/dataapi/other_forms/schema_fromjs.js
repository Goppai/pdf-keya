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

// Define the Query type
const query = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    getMgr: {
      type: Mgr,
      // `args` describes the arguments that the `user` query accepts
      args: {
        type: { type: graphql.GraphQLString },
      },
    },
  },
});

const mutation = new graphql.GraphQLObjectType({
  name: 'Mutation',
  fields: {
    getMgr: {
      type: Mgr,
      // `args` describes the arguments that the `user` query accepts
      args: {
        type: { type: graphql.GraphQLString },
      },
    },
  },
});

const schema = new graphql.GraphQLSchema({ query, mutation });

console.log(graphql.printSchema(schema));

export default schema;

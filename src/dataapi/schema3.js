import {
  GraphQLObjectType,
  GraphQLSchema,
  printSchema,
  GraphQLInputObjectType,
  // GraphQLNonNull,
  // GraphQLString,
  // GraphQLBoolean,
} from 'graphql';
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';
import makeDoc from './makedoc';

const customTypes = {
  IData: new GraphQLInputObjectType({
    name: 'IData',
    fields: {
      myValue: { type: GraphQLJSON },
      myObject: { type: GraphQLJSONObject },
    },
  }),
  OData: new GraphQLObjectType({
    name: 'OData',
    fields: {
      myValue: { type: GraphQLJSON },
      myObject: { type: GraphQLJSONObject },
    },
  }),
};

const createSchema = (type, client, prefix) => {
  const doc = makeDoc(type, customTypes, client, prefix);

  const query = new GraphQLObjectType({
    name: 'Query',
    fields: {
      ...doc.query,
    },
  });

  const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      ...doc.mutation,
    },
  });

  const schema = new GraphQLSchema({ query, mutation });

  console.log(printSchema(schema));

  return {
    schema,
    resolvers: doc.resolvers,
  };
};

export default createSchema;

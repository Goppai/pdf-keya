import {
  GraphQLObjectType, GraphQLSchema, printSchema, graphql,
} from 'graphql';
import makeDoc from './makedoc';

const createSchema = (client, docmetas) => {
  const fn = ({ type, customTypes, prefix }) => makeDoc(type, customTypes, client, prefix);
  const docs = docmetas.map(fn);

  const query = new GraphQLObjectType({
    name: 'Query',
    fields: {
      ...docs[0].query,
    },
  });

  const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      ...docs[0].mutation,
    },
  });

  const schema = new GraphQLSchema({ query, mutation });

  return {
    gql: printSchema(schema),
    schema,
    resolvers: { ...docs[0].resolvers },
  };
};

const createQuery = (client, docmetas) => {
  const { schema, resolvers } = createSchema(client, docmetas);
  return async (source, variableValues, operationName) => {
    const abc = await graphql({
      schema,
      source,
      rootValue: resolvers,
      variableValues,
      operationName,
    });
    return abc;
  };
};

export { createQuery };

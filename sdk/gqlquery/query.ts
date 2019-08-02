import {
  GraphQLObjectType, GraphQLSchema, printSchema, graphql,
} from 'graphql';
import { ClientDef } from 'seal-client/client';
import makeDoc from './makedoc';
import { queryFunc, DataAPISchema } from './types';

const createSchema = (client: ClientDef, docmetas: Array<DataAPISchema>) => {
  const fn = (params: DataAPISchema) => makeDoc(client, params);
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

const createQuery = (client: ClientDef, docmetas: Array<DataAPISchema>): queryFunc => {
  const { schema, resolvers } = createSchema(client, docmetas);
  return (source, variableValues, operationName) => graphql<any>({
    schema,
    source,
    rootValue: resolvers,
    variableValues,
    operationName,
  });
};

export { createQuery };

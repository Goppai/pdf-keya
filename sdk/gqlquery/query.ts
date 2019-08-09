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
    fields: docs.reduce((r, item) => ({ ...r, ...item.query }), {}),
  });

  const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: docs.reduce((r, item) => ({ ...r, ...item.mutation }), {}),
  });

  const schema = new GraphQLSchema({ query, mutation });

  return {
    gql: printSchema(schema),
    schema,
    resolvers: docs.reduce((r, item) => ({ ...r, ...item.resolvers }), {}),
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

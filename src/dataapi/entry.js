import { GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import { createQuery } from './query';

const query = null;

const getOrCreateQuery = (client) => {
  if (query) {
    return query;
  }
  return createQuery(client, [
    {
      type: 'keyayun.service.test',
      customTypes: {
        description: { type: GraphQLString },
        title: { type: GraphQLNonNull(GraphQLString) },
        done: { type: GraphQLBoolean },
      },
      prefix: 'TEST',
    },
  ]);
};

export { getOrCreateQuery };

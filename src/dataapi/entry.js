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
      dbindex: ['description', 'title'],
      dbview: [
        {
          name: 'view1',
          types: {
            title: { type: GraphQLString },
            done: { type: GraphQLBoolean },
          },
        },
        {
          name: 'view2',
          types: {
            description: { type: GraphQLString },
            done: { type: GraphQLBoolean },
          },
        },
      ],
      prefix: 'TEST',
    },
  ]);
};

export { getOrCreateQuery };

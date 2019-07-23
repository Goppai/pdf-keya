import {
  GraphQLInputObjectType,
  // GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
  GraphQLObjectType,
} from 'graphql';
import { createQuery } from './query';

const query = null;

const getOrCreateQuery = (client) => {
  if (query) {
    return query;
  }
  return createQuery(client, [
    {
      type: 'keyayun.service.tags',
      customTypes: {
        IData: new GraphQLInputObjectType({
          name: 'IData',
          fields: {
            description: { type: GraphQLString },
            title: { type: GraphQLString },
            done: { type: GraphQLBoolean },
          },
        }),
        OData: new GraphQLObjectType({
          name: 'OData',
          fields: {
            description: { type: GraphQLString },
            title: { type: GraphQLString },
            done: { type: GraphQLBoolean },
          },
        }),
      },
      prefix: 'TAGS',
    },
  ]);
};

export { getOrCreateQuery };

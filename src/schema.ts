import { GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import { DataAPISchema } from 'gqlquery';

const schema: Array<DataAPISchema> = [
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
];

export default schema;

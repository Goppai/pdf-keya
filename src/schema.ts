import {
  GraphQLNonNull, GraphQLString, GraphQLBoolean, GraphQLInt,
} from 'graphql';
import { DataAPISchema } from 'gqlquery';
import { GraphQLJSONObject } from 'graphql-type-json';

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
        view: 'view1',
        types: {
          title: { type: GraphQLString },
          done: { type: GraphQLBoolean },
        },
      },
      {
        name: 'view2',
        view: 'view2',
        types: {
          description: { type: GraphQLString },
          done: { type: GraphQLBoolean },
        },
      },
    ],
    prefix: 'TEST',
  },
  {
    type: 'keyayun.service.notifications1',
    customTypes: {
      type: { type: GraphQLNonNull(GraphQLString) },
      fromApp: { type: GraphQLNonNull(GraphQLString) },
      title: {
        type: GraphQLJSONObject,
      },
      message: { type: GraphQLNonNull(GraphQLString) },
      read: { type: GraphQLNonNull(GraphQLBoolean) },
      link: { type: GraphQLNonNull(GraphQLString) },
    },
    dbindex: ['sort-by-read-creation', 'sort-by-app-creation', 'sort-by-app-unread-creation'],
    dbview: [
      {
        name: 'uniquebyapp',
        view: 'unique-by-app',
        types: {
          unreadCount: { type: GraphQLNonNull(GraphQLInt) },
          readCount: { type: GraphQLNonNull(GraphQLInt) },
          app: { type: GraphQLNonNull(GraphQLString) },
        },
        props: {
          reduce: true,
          include_docs: false,
        },
      },
    ],
    prefix: 'NOTIF',
  },
];

export default schema;

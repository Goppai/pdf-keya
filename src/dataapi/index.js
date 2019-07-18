// Design a scheme
// Write a resolver
// Implement all queries
// Use it to do queries
import { graphql } from 'graphql';
// import schema from './schema_fromjs';
// import resolvers from './resolvers';

import createSchema from './schema2';

const { schema, resolvers } = createSchema('keyayun.service.test', null, 'TEST');

const query = async (source, variableValues, operationName) => {
  const abc = await graphql({
    schema,
    source,
    rootValue: resolvers,
    variableValues,
    operationName,
  });
  return abc;
};

export { query };

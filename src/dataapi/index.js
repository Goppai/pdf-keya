// Design a scheme
// Write a resolver
// Implement all queries
// Use it to do queries
import { graphql } from 'graphql';
import schema from './schema';
import root from './resolvers';

const query = async (source, variableValues, operationName) => {
  const abc = await graphql({
    schema,
    source,
    rootValue: root,
    variableValues,
    operationName,
  });
  return abc;
};

export { query };

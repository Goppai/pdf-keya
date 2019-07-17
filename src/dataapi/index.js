// Design a scheme
// Write a resolver
// Implement all queries
// Use it to do queries
import { graphql } from 'graphql';
import schema from './schema';
import root from './resolvers';

const query = async (q) => {
  const abc = await graphql(schema, q, root);
  return abc;
};

export { query };

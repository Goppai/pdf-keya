import { buildSchema } from 'graphql';

import def from './schema_def.gql'; // eslint-disable-line import/no-webpack-loader-syntax

const schema = buildSchema(def);

export default schema;

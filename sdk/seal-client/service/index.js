import fetch from 'node-fetch';

import { Client } from '../client';

if (global.fetch === null) {
  global.fetch = fetch;
}

const credentials = process.env.COZY_CREDENTIALS.trim();
const cozyURL = process.env.COZY_URL;

const createClient = () => new Client({
  uri: cozyURL,
  token: credentials,
});

// eslint-disable-next-line import/prefer-default-export
export { createClient };

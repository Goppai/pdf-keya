import 'isomorphic-fetch'
import Client from '../origin/packages/cozy-stack-client/src/CozyStackClient';


const credentials = process.env.COZY_CREDENTIALS.trim();
const cozyURL = process.env.COZY_URL;

const createClient = () =>
  new Client({
    uri: cozyURL,
    token: credentials,
  });

// eslint-disable-next-line import/prefer-default-export
export { createClient };

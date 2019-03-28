import path from 'path';

const req = require.context('../app/locales', false, /\.json$/);

const messages:{ [index:string]: {message: any} } = {};

req.keys().forEach((key) => {
  const name = path.basename(key).split('.')[0];
  messages[name] = req(key);
});

export default messages;

import path from 'path';
const req = require.context('./data', false, /\.json$/);

const messages = {};

req.keys().forEach(key => {
  const name = path.basename(key).split('.')[0];
  messages[name] = req(key);
});

export default messages;

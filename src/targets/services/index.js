import { createClient } from 'seal-client/service';
import service from 'app/service';

const client = createClient();

const getOptions = (argv) => {
  try {
    return JSON.parse(argv.slice(-1)[0]);
  } catch (e) {
    return {};
  }
};

const options = getOptions(process.argv);

service(client, options);

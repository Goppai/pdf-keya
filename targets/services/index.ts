import { createClient } from 'seal-client/service';
import { ClientDef } from 'seal-client/client';
import service from '../../src/service';

const client: ClientDef = createClient();

const getOptions = (argv: any[]) => {
  try {
    return JSON.parse(argv.slice(-1)[0]);
  } catch (e) {
    return {};
  }
};

const options: object = getOptions(process.argv);

service(client, options);

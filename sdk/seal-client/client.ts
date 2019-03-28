import React from 'react';
import { Document } from 'jsonapi-typescript';

import Client from './origin';

export interface ClientDef {
  fetchJSON: (method: string, path: string, payload?: object) => Promise<Document>;
}

const ClientContext = React.createContext<ClientDef>({
  fetchJSON: () => Promise.resolve({ errors: [] }),
});

export {
  Client,
  ClientContext,
};

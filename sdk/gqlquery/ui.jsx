import React, { useContext } from 'react';
import { Button } from 'antd';
import { ClientContext } from 'seal-client/client';
import { getOrCreateQuery } from './entry';

import DebuggerCreator from './debugger';

let Debugger = null;
let query = null;
const createDebugger = (client) => {
  if (Debugger != null) {
    return { query, Debugger };
  }
  query = getOrCreateQuery(client);
  Debugger = DebuggerCreator(query);
  return { query, Debugger };
};

const add = () => {
  // eslint-disable-next-line no-console
  query('{ hello }').then(console.log);
};
const list = () => {};
const del = () => {};

const UI = () => {
  const client = useContext(ClientContext);
  createDebugger(client);
  return (
    <div>
      <Button onClick={add}>Add</Button>
      <Button onClick={list}>List</Button>
      <Button onClick={del}>Delete</Button>
      <div style={{ height: 800 }}>{Debugger}</div>
    </div>
  );
};

export default UI;

import React from 'react';
import { Button } from 'antd';
import { query } from './index';

import DebuggerCreator from './debugger';

const Debugger = DebuggerCreator(query);

const add = () => {
  query('{ hello }').then(console.log);
};
const list = () => {};
const del = () => {};

const UI = () => (
  <div>
    <Button onClick={add}>Add</Button>
    <Button onClick={list}>List</Button>
    <Button onClick={del}>Delete</Button>
    <div style={{ height: 800 }}>{Debugger}</div>
  </div>
);

export default UI;

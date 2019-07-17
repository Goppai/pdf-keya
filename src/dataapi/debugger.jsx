import React from 'react';
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.css';

const Debugger = query => <GraphiQL fetcher={q => query(q.query)} />;

export default Debugger;

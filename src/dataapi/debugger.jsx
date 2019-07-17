import React from 'react';
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.css';

const Debugger = query => <GraphiQL fetcher={q => query(q.query, q.variables, q.operationName)} />;

export default Debugger;

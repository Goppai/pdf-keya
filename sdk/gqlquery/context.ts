import React from 'react';
import { GQLQueryContextInterface } from './types';

const GQLQueryContext = React.createContext<GQLQueryContextInterface>({});

export { GQLQueryContext };

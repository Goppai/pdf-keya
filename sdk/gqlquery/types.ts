import { ExecutionResult } from 'graphql';

export interface ViewConfig {
  name: string;
  types: any;
}

export interface DataAPISchema {
  type: string;
  customTypes: any;
  dbindex?: Array<string>;
  dbview?: Array<ViewConfig>;
  prefix: string;
}

export type queryFunc = (
  source: string,
  variableValues: { [key: string]: any },
  operationName?: string,
) => Promise<ExecutionResult<any>>;

export interface GQLQueryContextInterface {
  query?: queryFunc;
}

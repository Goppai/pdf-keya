/* global navbar */
import React from 'react';
import { render } from 'react-dom';

import {
  GQLQueryContext, GQLQueryContextInterface, createQuery, DebuggerUI,
} from 'gqlquery';
import { IntlProvider, updateMessages } from 'locales';
import { Client, ClientContext, ClientDef } from 'seal-client/client';

import App from '../../src/App';
import schema from '../../src/schema';
import appIcon from '../../src/icons/icon.svg';
import manifest from '../../src/manifest.webapp';

updateMessages(require.context('../../src/locales', false, /\.json$/));

const renderApp = (
  client: ClientDef,
  gqlquery: GQLQueryContextInterface | null,
  appLocale: string,
  timeZone: string,
) => {
  render(
    <IntlProvider locale={appLocale} timeZone={timeZone}>
      <ClientContext.Provider value={client}>
        {gqlquery ? (
          <GQLQueryContext.Provider value={gqlquery}>
            <App />
            <DebuggerUI />
          </GQLQueryContext.Provider>
        ) : (
          <App />
        )}
      </ClientContext.Provider>
    </IntlProvider>,
    document.querySelector('[role=application]'),
  );
};

// return a defaultData if the template hasn't been replaced by service
const getDataOrDefault = (toTest: string, defaultData: string) => {
  const templateRegex = /^\{\{\.[a-zA-Z]*\}\}$/; // {{.Example}}
  return templateRegex.test(toTest) ? defaultData : toTest;
};

// initial rendering of the application
document.addEventListener('DOMContentLoaded', () => {
  const root: HTMLDivElement = document.querySelector('[role=application]') as HTMLDivElement;
  const data: SealDataSet = (root.dataset as unknown) as SealDataSet;

  // initialize the client to interact with server
  const protocol: string = window.location ? window.location.protocol : 'https:';
  const cozyURL: string = `${protocol}//${data.domain}`;
  const client: ClientDef = new Client({
    uri: cozyURL,
    token: data.token,
  });

  const gqlquery = schema.length > 0 ? createQuery(client, schema) : null;

  const iconPath: string = getDataOrDefault(data.iconPath, appIcon);
  const appName: string = getDataOrDefault(data.appName, manifest.name);
  const appLocale: string = getDataOrDefault(data.locale, 'zh');
  const timeZone: string = getDataOrDefault(data.timeZone, '');
  navbar.init({
    appSlug: data.appSlug,
    cozyURL,
    token: data.token,
    appName,
    iconPath,
    lang: appLocale,
    timeZone,
  });

  renderApp(client, gqlquery && { query: gqlquery }, appLocale, timeZone);
});

/* global navbar */

import React from 'react';
import { render } from 'react-dom';

import { IntlProvider } from 'locales';
import { Client, ClientProvider } from 'seal-client/client';

import App from 'app/App';
import appIcon from '../../app/icons/favicon.png';
import manifest from '../../app/manifest.webapp';

const renderApp = (client, appLocale, timeZone) => {
  render(
    <IntlProvider locale={appLocale} timeZone={timeZone}>
      <ClientProvider client={client}>
        <App />
      </ClientProvider>
    </IntlProvider>,
    document.querySelector('[role=application]'),
  );
};

// return a defaultData if the template hasn't been replaced by service
const getDataOrDefault = (toTest, defaultData) => {
  const templateRegex = /^\{\{\.[a-zA-Z]*\}\}$/; // {{.Example}}
  return templateRegex.test(toTest) ? defaultData : toTest;
};

// initial rendering of the application
document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[role=application]');
  const data = root.dataset;

  // initialize the client to interact with server
  const protocol = window.location ? window.location.protocol : 'https:';
  const cozyURL = `${protocol}//${data.domain}`;
  const client = new Client({
    uri: cozyURL,
    token: data.token,
  });

  const iconPath = getDataOrDefault(data.iconPath, appIcon);
  const appName = getDataOrDefault(data.appName, manifest.name);
  const appLocale = getDataOrDefault(data.locale, 'zh');
  const timeZone = getDataOrDefault(data.timeZone, '');
  navbar.init({
    appSlug: data.appSlug,
    cozyURL,
    token: data.token,
    appName,
    iconPath,
    lang: appLocale,
    timeZone,
  });

  renderApp(client, appLocale, timeZone);
});

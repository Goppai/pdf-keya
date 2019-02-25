/* global cozy */

import React from 'react';
import { render } from 'react-dom';

import { IntlProvider } from 'locales';
import { Client, ClientProvider } from 'seal-client/client';

import App from 'app/App';

const renderApp = function(client, appLocale) {
  render(
    <IntlProvider locale={appLocale}>
      <ClientProvider client={client}>
        <App />
      </ClientProvider>
    </IntlProvider>,
    document.querySelector('[role=application]')
  );
};

// return a defaultData if the template hasn't been replaced by service
const getDataOrDefault = function(toTest, defaultData) {
  const templateRegex = /^\{\{\.[a-zA-Z]*\}\}$/; // {{.Example}}
  return templateRegex.test(toTest) ? defaultData : toTest;
};

// initial rendering of the application
document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[role=application]');
  const data = root.dataset;

  // initialize the client to interact with server
  const protocol = window.location ? window.location.protocol : 'https:';
  const client = new Client({
    uri: `${protocol}//${data.domain}`,
    token: data.token,
  });

  const appIcon = getDataOrDefault(data.iconPath, require('../vendor/assets/icon.svg'));
  const appName = getDataOrDefault(data.appName, require('../manifest.webapp').name);
  const appLocale = getDataOrDefault(data.locale, 'zh');
  cozy.bar.init({
    appName: appName,
    iconPath: appIcon,
    lang: appLocale,
  });

  renderApp(client, appLocale);
});

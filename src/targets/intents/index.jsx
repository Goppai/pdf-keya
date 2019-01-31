import React from 'react';
import CozyClient, { CozyProvider } from 'cozy-client';
import { render } from 'react-dom';
import schema from 'example/doctypes';
import App from 'example/components/App';
import { IntlProvider } from 'locales';

let appLocale;
const renderApp = function(client) {
  render(
    <IntlProvider locale={appLocale}>
      <CozyProvider client={client}>
        <App />
      </CozyProvider>
    </IntlProvider>,
    document.querySelector('[role=application]')
  );
};

// return a defaultData if the template hasn't been replaced by cozy-stack
const getDataOrDefault = function(toTest, defaultData) {
  const templateRegex = /^\{\{\.[a-zA-Z]*\}\}$/; // {{.Example}}
  return templateRegex.test(toTest) ? defaultData : toTest;
};

// initial rendering of the application
document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[role=application]');
  const data = root.dataset;

  appLocale = getDataOrDefault(data.cozyLocale, 'en');

  const protocol = window.location ? window.location.protocol : 'https:';

  // initialize the client to interact with the cozy stack
  const client = new CozyClient({
    uri: `${protocol}//${data.cozyDomain}`,
    token: data.cozyToken,
    schema
  });

  renderApp(client);
});

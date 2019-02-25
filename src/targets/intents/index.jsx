import React from 'react';
import { render } from 'react-dom';
import { IntlProvider } from 'locales';

import { Client, ClientProvider } from 'seal-client/client';
import { IFrame, IntentHandler } from 'seal-client/intent'

import Intent from 'app/Intent';

// return a defaultData if the template hasn't been replaced by cozy-stack
const getDataOrDefault = function(toTest, defaultData) {
  const templateRegex = /^\{\{\.[a-zA-Z]*\}\}$/; // {{.Example}}
  return templateRegex.test(toTest) ? defaultData : toTest;
};

// initial rendering of the application
document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[role=application]');
  const data = root.dataset;

  const appLocale = getDataOrDefault(data.locale, 'zh');
  const protocol = window.location ? window.location.protocol : 'https:';

  // initialize the client to interact with the cozy stack
  const client = new Client({
    uri: `${protocol}//${data.domain}`,
    token: data.token
  });

  render(
    <IntlProvider locale={appLocale}>
      <ClientProvider client={client}>
        <IntentHandler client={client}>
          <IFrame>
            <Intent />
          </IFrame>
        </IntentHandler>
      </ClientProvider>
    </IntlProvider>,
    document.querySelector('[role=application]')
  );
});

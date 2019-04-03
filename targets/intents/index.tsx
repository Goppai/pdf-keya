import React from 'react';
import { render } from 'react-dom';
import { IntlProvider, updateMessages } from 'locales';

import { Client, ClientContext } from 'seal-client/client';
import { IFrame, IntentHandler } from 'seal-client/intent';

import Intent from '../../src/Intent';

updateMessages(require.context('../../src/locales', false, /\.json$/));

// return a defaultData if the template hasn't been replaced by cozy-stack
const getDataOrDefault = (toTest: string, defaultData: string) => {
  const templateRegex = /^\{\{\.[a-zA-Z]*\}\}$/; // {{.Example}}
  return templateRegex.test(toTest) ? defaultData : toTest;
};

// initial rendering of the application
document.addEventListener('DOMContentLoaded', () => {
  const root: HTMLDivElement = document.querySelector('[role=application]') as HTMLDivElement;
  const data: SealDataSet = (root.dataset as unknown) as SealDataSet;

  const appLocale = getDataOrDefault(data.locale, 'zh');
  const timeZone = getDataOrDefault(data.timeZone, '');

  // initialize the client to interact with the cozy stack
  const protocol = window.location ? window.location.protocol : 'https:';
  const client = new Client({
    uri: `${protocol}//${data.domain}`,
    token: data.token,
  });

  render(
    <IntlProvider locale={appLocale} timeZone={timeZone}>
      <ClientContext.Provider value={client}>
        <IntentHandler>
          <IFrame>
            <Intent />
          </IFrame>
        </IntentHandler>
      </ClientContext.Provider>
    </IntlProvider>,
    document.querySelector('[role=application]'),
  );
});

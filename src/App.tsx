import React from 'react';
import { HashRouter } from 'react-router-dom';

import { injectIntl, defineMessages, InjectedIntlProps } from 'react-intl';
import { IntlConsumer, ContextDef } from 'locales';
import { Button } from 'antd';
import NotifTest from './NotifTest';
import UI from './dataapi/ui';

const messages = defineMessages({
  hello: {
    id: 'example.hello',
    defaultMessage: 'hello',
  },
  toenglish: {
    id: 'example.toenglish',
    defaultMessage: 'To English',
  },
  tochinese: {
    id: 'example.tochinese',
    defaultMessage: 'To Chinese',
  },
});

const App = ({ intl }: InjectedIntlProps) => (
  <HashRouter>
    <IntlConsumer>
      {({ switchLanguage }: ContextDef) => (
        <React.Fragment>
          <Button onClick={() => switchLanguage('en')}>
            {intl.formatMessage(messages.toenglish)}
          </Button>
          <Button onClick={() => switchLanguage('zh')}>
            {intl.formatMessage(messages.tochinese)}
          </Button>
          <div>{intl.formatMessage(messages.hello)}</div>
          <UI />
          <NotifTest />
        </React.Fragment>
      )}
    </IntlConsumer>
  </HashRouter>
);

export default injectIntl(App);

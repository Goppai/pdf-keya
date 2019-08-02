import React from 'react';
import { HashRouter } from 'react-router-dom';

import { injectIntl, InjectedIntlProps } from 'react-intl';
import { IntlConsumer, ContextDef } from 'locales';
import { Button } from 'antd';
import NotifTest from './NotifTest';

const App = ({ intl }: InjectedIntlProps) => (
  <HashRouter>
    <IntlConsumer>
      {({ switchLanguage }: ContextDef) => (
        <React.Fragment>
          <Button onClick={() => switchLanguage('en')}>
            {intl.formatMessage({ id: 'example.toenglish' })}
          </Button>
          <Button onClick={() => switchLanguage('zh')}>
            {intl.formatMessage({ id: 'example.tochinese' })}
          </Button>
          <div>{intl.formatMessage({ id: 'example.hello' })}</div>
          {/* <UI /> */}
          <NotifTest />
        </React.Fragment>
      )}
    </IntlConsumer>
  </HashRouter>
);

export default injectIntl(App);

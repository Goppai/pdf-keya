import React from 'react';

import { injectIntl, InjectedIntlProps } from 'react-intl';
import { IntlConsumer, ContextDef } from 'locales';
import { Button } from 'antd';

const TranslateTest = ({ intl }: InjectedIntlProps) => (
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
      </React.Fragment>
    )}
  </IntlConsumer>
);

export default injectIntl(TranslateTest);

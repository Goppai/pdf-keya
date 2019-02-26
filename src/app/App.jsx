import React from 'react';
import { HashRouter } from 'react-router-dom';

import { injectIntl, defineMessages } from 'react-intl';

const messages = defineMessages({
  hello: {
    id: 'example.hello',
    defaultMessage: 'hello'
  }
});

const App = props => (
  <HashRouter>
    <div>{props.intl.formatMessage(messages.hello)}</div>
  </HashRouter>
);

export default injectIntl(App);

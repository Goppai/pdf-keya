import React from 'react';
import { HashRouter } from 'react-router-dom';

import { injectIntl, defineMessages, intlShape } from 'react-intl';

const messages = defineMessages({
  hello: {
    id: 'example.hello',
    defaultMessage: 'hello',
  },
});

const App = ({ intl }) => (
  <HashRouter>
    <div>{intl.formatMessage(messages.hello)}</div>
  </HashRouter>
);

App.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(App);

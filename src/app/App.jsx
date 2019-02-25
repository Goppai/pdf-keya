import React from 'react'
import { HashRouter } from 'react-router-dom'

import { injectIntl } from 'react-intl';

const App = props => (
  <HashRouter>
    <div>
      {props.intl.formatMessage({ id: 'example.hello' })}
    </div>
  </HashRouter>
)

export default injectIntl(App)

import React from 'react';
import { addLocaleData, IntlProvider } from 'react-intl';

import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';

import messages from './messages';

addLocaleData([...zh, ...en]);

const { Provider, Consumer } = React.createContext();

class IntlProviderWrapper extends React.Component {
  constructor(...args) {
    super(...args);

    this.switchLanguage = locale => this.setState({ locale });

    // pass everything in state to avoid creating object inside render method (like explained in the documentation)
    this.state = {
      locale: this.props.locale,
      switchLanguage: this.switchLanguage
    };
  }

  render() {
    const { children } = this.props;
    const locale = messages[this.state.locale] ? this.state.locale : 'zh';
    return (
      <Provider value={this.state}>
        <IntlProvider
          key={locale}
          locale={locale}
          messages={messages[locale]}
          defaultLocale="en"
        >
          {children}
        </IntlProvider>
      </Provider>
    );
  }
}

// Write wrapper here
export { IntlProviderWrapper as IntlProvider, Consumer as IntlConsumer };

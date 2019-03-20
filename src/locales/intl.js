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

    // pass everything in state to avoid creating object inside render method (like explained in the documentation)
    this.state = {
      locale: this.props.locale,
      timeZone: this.props.timeZone || '',
      switchLanguage: this.switchLanguage,
      switchTimeZone: this.switchTimeZone,
    };
  }

  switchLanguage = locale => this.setState({ locale });

  switchTimeZone = timeZone => this.setState({ timeZone });

  render() {
    const { children } = this.props;
    const { locale, timeZone } = this.state;
    const validLocale = messages[locale] ? locale : 'zh';
    return (
      <Provider value={this.state}>
        <IntlProvider
          key={locale}
          locale={validLocale}
          timeZone={timeZone}
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

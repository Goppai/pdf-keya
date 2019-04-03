import React, { ReactChild, Component } from 'react';
import PropTypes from 'prop-types';
import { addLocaleData, IntlProvider } from 'react-intl';

import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';

import messages from './messages';

addLocaleData([...zh, ...en]);

interface PropTypes {
  readonly children: ReactChild;
  locale: string;
  timeZone: string;
}

interface State {
  locale: string;
  timeZone: string;
}

export interface ContextDef {
  switchLanguage: (locale: string) => void;
  switchTimeZone: (timeZone: string) => void;
}

const { Provider, Consumer } = React.createContext<ContextDef>({} as ContextDef);

class IntlProviderWrapper extends Component<PropTypes, State> {
  constructor(props: PropTypes, context: any) {
    super(props, context);

    const { locale, timeZone } = this.props;

    // pass everything in state to avoid creating object inside
    // render method (like explained in the documentation)
    this.state = {
      locale,
      timeZone: timeZone || '',
    };
  }

  switchLanguage = (locale: string) => this.setState({ locale });

  switchTimeZone = (timeZone: string) => this.setState({ timeZone });

  render() {
    const { children } = this.props;
    const { locale, timeZone } = this.state;
    const validLocale: string = messages[locale] ? locale : 'zh';
    return (
      <Provider
        value={{
          switchLanguage: this.switchLanguage,
          switchTimeZone: this.switchTimeZone,
        }}
      >
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

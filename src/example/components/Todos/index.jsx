import React from 'react';

import { queryConnect } from 'cozy-client';
import { FormattedMessage } from 'react-intl';

import { todosQuery } from '../../doctypes';

import TodoAdd from './TodoAdd';
import TodosList from './TodosList';
import { IntlConsumer } from 'locales';

const LanguageSwitch = () => (
  <IntlConsumer>
    {({ switchLanguage }) => (
      <React.Fragment>
        <button onClick={switchLanguage.bind(null, 'en')}>English</button>
        <button onClick={switchLanguage.bind(null, 'zh')}>Chinese</button>
      </React.Fragment>
    )}
  </IntlConsumer>
);

export const Todos = props => {
  const { data, fetchStatus } = props.todos;
  // cozy-client statuses
  const isLoading = fetchStatus === 'loading' || fetchStatus === 'pending';
  return (
    <div className="todos">
      {isLoading ? (
        <div>
          <FormattedMessage id="example.loading" defaultMessage="Loading..." />
        </div>
      ) : (
        <div>
          <LanguageSwitch />
          <TodosList todos={data} />
          <TodoAdd />
        </div>
      )}
    </div>
  );
};

// get data from the client state: data, fetchStatus
export default queryConnect({
  todos: {
    query: todosQuery,
    as: 'todos'
  }
})(Todos);

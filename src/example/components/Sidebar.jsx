import React from 'react';
import { translate } from '../reference/i18n';
import { NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

export const Sidebar = ({ t }) => (
  <aside className="o-sidebar">
    <nav>
      <ul className="c-nav">
        <li className="c-nav-item">
          <NavLink
            to="/todos"
            className="c-nav-link"
            activeClassName="is-active"
          >
            <FormattedMessage id="Nav.todos" defaultMessage="Todos" />
          </NavLink>
        </li>
        <li className="c-nav-item">
          <NavLink
            to="/viewhello1"
            className="c-nav-link"
            activeClassName="is-active"
          >
            <FormattedMessage id="Nav.hello_nav_2" defaultMessage="Second" />
          </NavLink>
        </li>
        <li className="c-nav-item">
          <NavLink
            to="/viewhello2"
            className="c-nav-link"
            activeClassName="is-active"
          >
            <FormattedMessage id="Nav.hello_nav_3" defaultMessage="Third" />
          </NavLink>
        </li>
      </ul>
    </nav>
  </aside>
);

// translate() provide t() to use translations (ex: locales/en.json)
export default translate()(Sidebar);

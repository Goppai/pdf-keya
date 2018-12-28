import React from 'react'
//import Icon from 'cozy-ui/react/Icon'
import {
  Layout, Menu, Breadcrumb, Icon,
} from 'antd';
import { translate } from 'reference/i18n'
import { NavLink } from 'react-router-dom'
// import NavIcon from '../assets/icons/icon-bullet-point.svg'

const {
  Header, Content, Footer, Sider,
} = Layout;

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
            {/* <Icon className="c-nav-icon" icon={NavIcon} /> */}
            {t('Nav.todos')}
          </NavLink>
        </li>
        <li className="c-nav-item">
          <NavLink
            to="/viewhello1"
            className="c-nav-link"
            activeClassName="is-active"
          >
            {/* <Icon className="c-nav-icon" icon={NavIcon} /> */}
            {t('Nav.hello_nav_2')}
          </NavLink>
        </li>
        <li className="c-nav-item">
          <NavLink
            to="/viewhello2"
            className="c-nav-link"
            activeClassName="is-active"
          >
            {/* <Icon className="c-nav-icon" icon={NavIcon} /> */}
            {t('Nav.hello_nav_3')}
          </NavLink>
        </li>
      </ul>
    </nav>
  </aside>
)

// translate() provide t() to use translations (ex: locales/en.json)
export default translate()(Sidebar)

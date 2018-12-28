import React from 'react'
import { Route, Switch, Redirect, HashRouter } from 'react-router-dom'

import {
  Layout
} from 'antd';

import Sidebar from './Sidebar'
import Todos from './Todos'
import Hello1 from './HelloViews/Hello1'
import Hello2 from './HelloViews/Hello2'

const {
  Content
} = Layout;

const App = () => (
  <HashRouter>
    <Layout>
      <Sidebar />
      <Content className="app-content">
        <Switch>
          <Route path="/todos" component={Todos} />
          <Route path="/viewhello1" component={Hello1} />
          <Route path="/viewhello2" component={Hello2} />
          <Redirect from="/" to="/todos" />
          <Redirect from="*" to="/todos" />
        </Switch>
      </Content>
    </Layout>
  </HashRouter>
)

export default App


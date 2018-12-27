import React from 'react'
import { Route, Switch, Redirect, HashRouter } from 'react-router-dom'
// import { Layout, Main, Content } from 'cozy-ui/react/Layout'
// import { Sprite as IconSprite } from 'cozy-ui/react/Icon'

import Sidebar from './Sidebar'
import Todos from './Todos'
import Hello1 from './HelloViews/Hello1'
import Hello2 from './HelloViews/Hello2'

const App = () => (
  <HashRouter>
    <div>
      <Sidebar />
      <Switch>
        <Route path="/todos" component={Todos} />
        <Route path="/viewhello1" component={Hello1} />
        <Route path="/viewhello2" component={Hello2} />
        <Redirect from="/" to="/todos" />
        <Redirect from="*" to="/todos" />
      </Switch>
    </div>
  </HashRouter>
)

export default App


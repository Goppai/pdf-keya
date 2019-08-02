import React from 'react';
import { HashRouter } from 'react-router-dom';

import { Tabs } from 'antd';

import NotifTest from './NotifTest';
import TranslateTest from './TranslateTest';
import TODOList from './TodoList';

const { TabPane } = Tabs;

const App = () => (
  <HashRouter>
    <Tabs defaultActiveKey="1">
      <TabPane tab="Translate" key="1">
        <TranslateTest />
      </TabPane>
      <TabPane tab="Notification" key="2">
        <NotifTest />
      </TabPane>
      <TabPane tab="gqlquery" key="3">
        <TODOList />
      </TabPane>
    </Tabs>
  </HashRouter>
);

export default App;

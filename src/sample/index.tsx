import React from 'react';
import { HashRouter } from 'react-router-dom';

import { Tabs } from 'antd';

import NotifTest from './NotifTest';
import TranslateTest from './TranslateTest';

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
        Content of Tab Pane 3
      </TabPane>
    </Tabs>
  </HashRouter>
);

export default App;

/* eslint-disable no-console */
import React, { Fragment } from 'react';
import { Button } from 'antd';
import { ClientContext } from 'seal-client/client';
import {
  sendNotification,
  sendScheduleNotification,
  cancelScheduleNotification,
} from 'seal-client/notification';

class NotifTest extends React.Component {
  sendNotif = async (client) => {
    const res = await sendNotification(client, {
      appSlug: 'drive',
      link: '',
      titleWithLocales: {
        zh: ['通知测试', '普通'],
        'zh-Hant-HK': ['通知測試', '普通'],
        en: ['Notification Test', 'common'],
      },
      message: 'sendNotification',
    });
    console.log('sendNotification', res);
  };

  sendSchedule = async (client) => {
    const res = await sendScheduleNotification(client, {
      appSlug: 'drive',
      titleWithLocales: {
        zh: ['通知测试', '定时'],
        'zh-Hant-HK': ['通知測試', '定時'],
        en: ['Notification Test', 'schedule'],
      },
      message: 'sendScheduleNotification',
      listeners: ['api.ip-10-3-4-91.bj.keyayun.com:8080'], // default: my instance domain
      time: new Date(Date.now() + 10000), // 10s
    });
    this.cancelId = res.id;
    console.log('sendSchedule', res);
  };

  cancelSchedule = async (client) => {
    if (this.cancelId) {
      await cancelScheduleNotification(client, this.cancelId);
      console.log('cancelSchedule');
    }
  };

  render() {
    return (
      <div>
        <ClientContext.Consumer>
          {client => (
            <Fragment>
              <Button onClick={() => this.sendNotif(client)}>发送通知</Button>
              <Button onClick={() => this.sendSchedule(client)}>定时通知</Button>
              <Button onClick={() => this.cancelSchedule(client)}>取消定时</Button>
            </Fragment>
          )}
        </ClientContext.Consumer>
      </div>
    );
  }
}

export default NotifTest;

import { ClientDef } from 'seal-client/client';

enum NotifType {
  APP = 'app',
  SERVICE = 'appservice',
  SYSTEM = 'system',
}

interface NotifTitle {
  zh: string[];
  'zh-Hant-HK': string[];
  en: string[];
  [propName: string]: any;
}

interface NotifData {
  appSlug: string;
  titleWithLocales: NotifTitle;
  type?: NotifType;
  message?: string;
  link?: string;
  listeners?: string[];
}

interface ScheduleNotifData extends NotifData {
  time: Date;
}

const checkParam = (param: NotifData | ScheduleNotifData): string => {
  if (!param.appSlug) {
    return 'missing parameters: appSlug';
  }
  if (!param.titleWithLocales) {
    return 'missing parameters: titleWithLocales';
  }
  const isOk = ['zh', 'zh-Hant-HK', 'en'].every(
    key => Reflect.has(param.titleWithLocales, key) && Array.isArray(param.titleWithLocales[key]),
  );
  if (!isOk) {
    return 'parameter invalid: titleWithLocales';
  }
  return '';
};

const getDefaultListeners = (): string[] => {
  const root: HTMLDivElement = document.querySelector('[role=application]') as HTMLDivElement;
  const data: SealDataSet = (root.dataset as unknown) as SealDataSet;
  return [data.domain];
};

const sendNotification = async (client: ClientDef, notifData: NotifData) => {
  const error = checkParam(notifData);
  if (error) {
    throw Error(error);
  }
  const {
    appSlug, titleWithLocales, type, message, link, listeners,
  } = notifData;
  return client.fetchJSON('POST', '/notify', {
    content: {
      app: appSlug,
      title: titleWithLocales,
      type: type || NotifType.APP,
      message: message || '',
      link: link || '',
    },
    listener: listeners || getDefaultListeners(),
  });
};

const sendScheduleNotification = async (client: ClientDef, notifData: ScheduleNotifData) => {
  const error = checkParam(notifData);
  if (error) {
    throw Error(error);
  }
  const {
    appSlug, titleWithLocales, type, message, link, listeners, time,
  } = notifData;
  return client.fetchJSON('POST', '/notify/schedule', {
    content: {
      app: appSlug,
      title: titleWithLocales,
      type: type || NotifType.APP,
      message: message || '',
      link: link || '',
    },
    listener: listeners || getDefaultListeners(),
    at: Math.floor(time.getTime() / 1000),
  });
};

const cancelScheduleNotification = (client: ClientDef, id: string) => client.fetchJSON('DELETE', '/notify/schedule', {
  id,
});

export { sendNotification, sendScheduleNotification, cancelScheduleNotification };

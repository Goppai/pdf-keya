declare interface SealDataSet {
  iconPath: string;
  appName: string;
  locale: string;
  timeZone: string;
  domain: string;
  token: string;
  appSlug: string;
}

interface NavBarInit {
  appSlug: string;
  cozyURL: string;
  token: string;
  appName: string;
  iconPath: string;
  lang: string;
  timeZone: string;
}

interface NavBar {
  init: (arg0: NavBarInit) => void;
}

declare let navbar: NavBar;

import { getOrCreateMgr } from './mgr';

const root = {
  getMgr({ type }) {
    return getOrCreateMgr(type);
  },
};

export default root;

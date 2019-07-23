import MgrIml from './_mgr';

const mgrs = {};

const getOrCreateMgr = (type) => {
  if (mgrs[type] == null) {
    mgrs[type] = MgrIml(type);
  }
  return mgrs[type];
};

export { getOrCreateMgr };

import React, { useContext, useState } from 'react';
import { Button } from 'antd';
import { GQLQueryContext } from './context';

import DebuggerCreator from './debugger';

let UI = () => <div />;

if (process.env.NODE_ENV === 'development') {
  let Debugger = null;
  const createDebugger = (query) => {
    if (Debugger != null) {
      return { query, Debugger };
    }
    Debugger = DebuggerCreator(query);
    return { query, Debugger };
  };

  UI = () => {
    const { query } = useContext(GQLQueryContext);
    createDebugger(query);
    const [hidden, setHideen] = useState(true);
    return (
      <React.Fragment>
        <Button
          style={{
            zIndex: 1000001,
            position: 'fixed',
            bottom: 0,
            right: 0,
          }}
          onClick={() => setHideen(!hidden)}
        >
          切换调试器
        </Button>
        {!hidden && (
          <div
            style={{
              zIndex: 100,
              position: 'fixed',
              right: 0,
              left: 0,
              top: 48,
              bottom: 0,
            }}
          >
            {Debugger}
          </div>
        )}
      </React.Fragment>
    );
  };
}

const M = UI;

export default M;

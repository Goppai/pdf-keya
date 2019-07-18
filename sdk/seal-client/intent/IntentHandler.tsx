import React, {
  FunctionComponent, useState, useEffect, useContext,
} from 'react';

import { ClientContext } from '../client';
import { start } from './service';

const IntentHandler: FunctionComponent<{
readonly intentId?: string;
readonly children: React.ReactElement;
}> = (props) => {
  const client = useContext(ClientContext);
  const { intentId, children, ...rest } = props;
  const [data, setData] = useState<{ service?: object }>({});

  useEffect(() => {
    const loadIntent = async () => {
      if (data.service) {
        return;
      }

      try {
        const service = await start(client, intentId, window);
        const { type, ...r } = service.getData();
        if (type.includes('data')) {
          setData({ service, ...r });
        } else {
          setData({ service });
        }
      } catch (error) {
        throw error;
      }
    };
    loadIntent();
    return () => {};
  }, [client, data, intentId]);

  if (!data.service) {
    return <div id="intent_placeholder" />;
  }

  return React.cloneElement(children, { ...rest, ...data });
};

// eslint-disable-next-line import/prefer-default-export
export { IntentHandler };

import React, { useState, useEffect } from 'react'

import { start } from './service'

const IntentHandler = props => {
  const { intentId, children, client, ...rest } = props
  const [ data, setData ] = useState({});

  const loadIntent = async () => {
    if (data.service) {
      return;
    }

    try {
      const service = await start(client.stackClient, intentId, window);
      const { type, ...rest } = service.getData();
      if (type.includes('data')) {
        setData({ service, ...rest });
      } else {
        setData({ service });
      }
    } catch (error) {
      throw(error)
    }
  };

  useEffect(() => {
    loadIntent();
    return () => {};
  }, [data]); 

  if (!data.service) {
    return (<div id="intent_placeholder"/>);
  } 

  return React.cloneElement(children, { ...rest, ...data });
}

export {
  IntentHandler,
};


function mapErrorProperties(from, to) {
  const result = Object.assign(to, from);
  const nativeProperties = ['name', 'message'];
  return nativeProperties.reduce((result, property) => {
    if (from[property]) {
      to[property] = from[property];
    }
    return result;
  }, result);
}

const errorSerializer = {
  serialize: error => mapErrorProperties(error, {}),
  deserialize: data => mapErrorProperties(data, new Error(data.message)),
};

function listenClientData(intent, window) {
  return new Promise(resolve => {
    const messageEventListener = event => {
      if (event.origin !== intent.attributes.client) {
        return;
      }

      window.removeEventListener('message', messageEventListener);
      resolve(event.data);
    };

    window.addEventListener('message', messageEventListener);
    window.parent.postMessage({ type: `intent-${intent.id}:ready` }, intent.attributes.client);
  })
}

// maximize the height of an element
function maximize(element) {
  if (element && element.style) {
    element.style.height = '100%';
  }
}

async function start(client, intentId, serviceWindow) {
  serviceWindow = serviceWindow || (typeof window !== 'undefined' && window)
  if (!serviceWindow || !serviceWindow.document) {
    return Promise.reject(new Error('Intent service should be used in browser'))
  }

  // Maximize document, the whole iframe is handled by intents, clients and
  // services
  serviceWindow.addEventListener('load', () => {
    const { document } = serviceWindow;
    [document.documentElement, document.body].forEach(maximize);
  })

  intentId = intentId || serviceWindow.location.search.split('=')[1]
  if (!intentId) {
    return Promise.reject(new Error('Cannot retrieve intent from URL'))
  }

  const ret = await client.fetchJSON('GET', `/intents/${intentId}`);
  const intent = ret.data;
  if (!!intent.attributes.origin && intent.attributes.origin !== '') {
    intent.attributes.client = intent.attributes.origin
  }

  let terminated = false;
  const sendMessage = message => {
    if (terminated) {
      throw new Error('Intent service has already been terminated')
    }
    serviceWindow.parent.postMessage(message, intent.attributes.client)
  };

  const compose = (action, doctype, data) => new Promise(resolve => {
    const composeEventListener = event => {
      if (event.origin !== intent.attributes.client) {
        return;
      }
      serviceWindow.removeEventListener('message', composeEventListener);
      return resolve(event.data);
    };

    serviceWindow.addEventListener('message', composeEventListener);

    sendMessage({
      type: `intent-${intent.id}:compose`,
      action,
      doctype,
      data
    });
  });

  const terminate = message => {
    sendMessage(message);
    terminated = true;
  };

  const resizeClient = (dimensions, transitionProperty) => {
    if (terminated) {
      throw new Error('Intent service has been terminated');
    }

    sendMessage({
      type: `intent-${intent.id}:resize`,
      // if a dom element is passed, calculate its size
      dimensions: dimensions.element
        ? Object.assign({}, dimensions, {
            maxHeight: dimensions.element.clientHeight,
            maxWidth: dimensions.element.clientWidth
          })
        : dimensions,
      transition: transitionProperty
    });
  };

  const cancel = () => {
    terminate({ type: `intent-${intent.id}:cancel` })
  };

  const message = (data) => {
    if (terminated) {
      throw new Error('Intent service has been terminated');
    }

    sendMessage({
      data,
      type: `intent-${intent.id}:message`,
    });
  }

  // Prevent unfulfilled client promises when this window unloads for a
  // reason or another.
  if (process.env.NODE_ENV !== 'development') {
    serviceWindow.addEventListener('unload', () => {
      if (!terminated) {
        cancel();
      }
    });
  }

  const data = await listenClientData(intent, serviceWindow);
  return {
    cancel,
    compose,
    message,
    resizeClient,
    getData: () => data,
    getIntent: () => intent,
    terminate: doc => {
      const eventName = data && data.exposeIntentFrameRemoval ? 'exposeFrameRemoval': 'done';
      return terminate({
        type: `intent-${intent.id}:${eventName}`,
        document: doc
      });
    },
    throw: error => terminate({
      type: `intent-${intent.id}:error`,
      error: errorSerializer.serialize(error)
    }),
  };
}

export {
  start,
}

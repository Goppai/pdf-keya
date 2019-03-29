import React, { useState, useCallback, useLayoutEffect } from 'react';

import ResizeObserver from 'resize-observer-polyfill';

type OrNull < T > = T | null;

function getSize(el: OrNull<HTMLElement>) {
  if (!el) {
    return {
      width: 0,
      height: 0,
    };
  }

  return {
    width: el.offsetWidth,
    height: el.offsetHeight,
  };
}

function useComponentSize(ref: React.RefObject<HTMLElement>) {
  const [ComponentSize, setComponentSize] = useState(getSize(ref ? ref.current : null));

  const handleResize = useCallback(() => {
    if (ref.current) {
      setComponentSize(getSize(ref.current));
    }
  }, [ref]);

  useLayoutEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    handleResize();

    if (typeof ResizeObserver === 'function') {
      let resizeObserver: OrNull<ResizeObserver> = new ResizeObserver(() => handleResize());
      resizeObserver.observe(ref.current);

      return () => {
        if (resizeObserver) {
          if (ref.current) {
            resizeObserver.unobserve(ref.current);
          }
          resizeObserver.disconnect();
        }
        resizeObserver = null;
      };
    }
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [ref.current]);

  return ComponentSize;
}

export { useComponentSize };

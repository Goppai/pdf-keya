import { useEffect, useState } from 'react';

function useAsyncEffect(effect, dependencies) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await effect(...dependencies);
        setData(res);
      } catch (e) {
        console.error(e); // eslint-disable-line
        setError(e);
      }
    })();
  }, dependencies); // eslint-disable-line

  return { data, error };
}

export default useAsyncEffect;

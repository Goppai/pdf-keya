import React, { FunctionComponent, useState, useEffect } from 'react';

const IFrame: FunctionComponent<{
readonly children: React.ReactElement;
}> = (prop) => {
  const [data, setData] = useState<any>({});
  const { children, ...rest } = prop;

  // To avoid effect get executed more than once, consider using origin in the future
  const [placeHolder] = useState(0);

  useEffect(() => {
    const msgHandler = (event: any) => {
      // 判断 origin 是否相符, optional
      //   const { origin } = this.props;
      //   if (origin && origin !== event.origin) {
      //     // TODO Error!
      //     return;
      //   }

      // 判断消息类型, 并更新数据; 方法任意, setState/redux/...
      const { type, ...r } = event.data;
      if (type.includes('data')) {
        setData(r);
      }
    };

    window.addEventListener('message', msgHandler);
    return () => {
      window.removeEventListener('message', msgHandler);
    };
  }, [placeHolder]);

  return React.cloneElement(children, { ...rest, ...data });
};

// eslint-disable-next-line import/prefer-default-export
export { IFrame };

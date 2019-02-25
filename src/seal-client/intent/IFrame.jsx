import React, { useState, useEffect } from 'react'

function IFrame(props) {
  const { children, ...rest } = props;

  const [ data, setData ] = useState({})

  // To avoid effect get executed more than once, consider using origin in the future
  const [ placeHolder ] = useState(0)

  useEffect(() => {
    const msgHandler = (event) => {
      // 判断 origin 是否相符, optional
    //   const { origin } = this.props;
    //   if (origin && origin !== event.origin) {
    //     // TODO Error!
    //     return;
    //   }

      // 判断消息类型, 并更新数据; 方法任意, setState/redux/...
      const { type, ...rest } = event.data;
      if (type.includes('data')) {
        setData(rest);
      }
    };

    window.addEventListener('message', msgHandler);
    return () => {
      window.removeEventListener('message', msgHandler)
    };
  }, [placeHolder]);

  return (
    <div>
      {React.cloneElement(children, { ...rest, ...data })}
    </div>
  )
}

export {
  IFrame,
};

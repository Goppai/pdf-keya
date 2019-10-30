import { css } from 'styled-components';

export default css`
  /* 设置滚动条的样式 */
  ::-webkit-scrollbar {
    background: transparent;
  }
  /* 滚动槽 */
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-corner {
    background: transparent;
  }
  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
  }
`;

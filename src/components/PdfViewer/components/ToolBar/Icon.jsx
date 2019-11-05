import styled from 'styled-components';
import { Icon } from 'antd';

export default styled(Icon)`
  font-size: 14px;
  padding: 10px ${p => p.pr || 12}px 10px ${p => p.pl || 12}px;
  color: ${p => (p.disabled ? 'rgba(0, 0, 0, 0.65)' : 'black')};
  &:hover:not([disabled]) {
    color: #1890ff;
  }
`;

import styled from 'styled-components';
import Container from './Container';
import Icon from './Icon';
import Zoom from './Zoom';
import Paging from './Paging';

export const ToolBarWrapper = styled.div`
  display: flex;
  min-width: 100%;
  text-align:center;
  align-items:center;
  justify-content: space-between;
  position: absolute;
  background: #FFFFFF;
  top: 0px;
  transform: translateX(-50%);
  left: 50%;
  z-index:102;
  opacity: ${p => (p.show ? 1 : 0)};
  transition: opacity 0.5s;
  user-select: none;
  box-shadow: 2px 0 8px 0 rgba(0,0,0,0.15);
`;

const ToolBar = Container;

Object.assign(ToolBar, {
  Icon,
  Zoom,
  Paging,
});

export default ToolBar;

import styled from 'styled-components';
import Container from './Container';
import Icon from './Icon';
import Zoom from './Zoom';
import Paging from './Paging';

export const ToolBarWrapper = styled.div`
  display: flex;
  min-width: 100%;
  text-align:center;
  justify-content: center;
  position: absolute;
  top: 0px;
  transform: translateX(-50%);
  left: 50%;
  opacity: ${p => (p.show ? 1 : 0)};
  transition: opacity 0.5s;
  user-select: none;
`;

const ToolBar = Container;

Object.assign(ToolBar, {
  Icon,
  Zoom,
  Paging,
});

export default ToolBar;

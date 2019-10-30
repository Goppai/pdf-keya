import React, { Children } from 'react';
import PropsTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  height: 48px;
  width:100%;
  background: #FFFFFF;
  box-shadow: 2px 0 8px 0 rgba(0,0,0,0.15);
  float: left;
  padding: 0 5px;
  z-index: 999;
`;
const ItemWrapper = styled.div`
  display: inline-block;
  line-height: 48px;
`;

// eslint-disable-next-line react/prop-types
const Container = ({ children }) => (
  <Wrapper>
    {Children.map(children, element => (
      <ItemWrapper>{element}</ItemWrapper>
    ))}
  </Wrapper>
);

Container.propsType = {
  children: PropsTypes.oneOfType([PropsTypes.element, PropsTypes.arrayOf(PropsTypes.element)]),
};

export default Container;

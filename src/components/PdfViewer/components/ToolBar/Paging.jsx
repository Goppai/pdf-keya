import React, { useState, useLayoutEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Icon from './Icon';

const Container = styled.div`
  display: flex;
  align-items: center;
`;
const Input = styled.input`
  border: none;
  outline: none;
  height: 24px;
  width: 32px;
  border-radius: 2px;
  text-align: center;
  color: rgba(0, 0, 0, 0.65);
  background: rgba(0, 0, 0, 0.25);
  &&::-webkit-outer-spin-button,
  &&::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`;
const Text = styled.span`
  font-size: 14px;
  margin-left: 4px;
  color: rgba(0, 0, 0, 0.65);
  user-select: none;
`;

const Paging = ({
  current = 0, total = 0, onPrev, onNext, onPageChange,
}) => {
  const [pageValue, setPageValue] = useState(current);
  useLayoutEffect(() => {
    setPageValue(current);
  }, [current]);

  const onKeyDown = (evt) => {
    if (evt.key === 'Enter') {
      onPageChange(parseInt(evt.target.value, 10));
    }
  };

  const onValueChange = (evt) => {
    setPageValue(evt.target.value);
  };

  return (
    <Container>
      <Icon type="left" mr={8} onClick={onPrev} />
      <Input type="number" onChange={onValueChange} onKeyDown={onKeyDown} value={pageValue} />
      <Text>/ {total}</Text>
      <Icon type="right" ml={8} onClick={onNext} />
    </Container>
  );
};

Paging.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Paging;

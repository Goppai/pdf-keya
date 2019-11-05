import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icon from './Icon';

const Container = styled.div`
  display: flex;
  align-items: center;
`;
const Number = styled.span`
  display: block;
  min-width: 3em;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  text-align: center;
  user-select: none;
  &::after {
    content: '%';
  }
`;

const Zoom = ({
  onZoomIn, onZoomOut, zoomInDisabled, zoomOutDisabled, percent = 100,
}) => (
  <Container>
    <Icon
      type="zoom-out"
      pl={12}
      pr={8}
      disabled={zoomOutDisabled}
      onClick={zoomOutDisabled ? null : onZoomOut}
    />
    <Number>{percent}</Number>
    <Icon
      type="zoom-in"
      pl={8}
      pr={12}
      disabled={zoomInDisabled}
      onClick={zoomInDisabled ? null : onZoomIn}
    />
  </Container>
);

Zoom.propTypes = {
  onZoomIn: PropTypes.func.isRequired,
  onZoomOut: PropTypes.func.isRequired,
  zoomInDisabled: PropTypes.bool.isRequired,
  zoomOutDisabled: PropTypes.bool.isRequired,
  percent: PropTypes.number.isRequired,
};

export default Zoom;

import React from 'react';
import fp from 'lodash/fp';

const mapMessageToProps = data => {
  // TODO: map data to props
  return data;
};

const Intent = props => {
  // TODO: Replace this div with intent component
  return <div {...props}>Intent</div>;
};

export default fp.compose(
  Intent,
  mapMessageToProps,
);

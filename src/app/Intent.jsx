import React from 'react';
import fp from 'lodash/fp';

const mapMessageToProps = data => data;
const Intent = props => <div {...props}>Intent</div>;
export default fp.compose(
  Intent,
  mapMessageToProps,
);

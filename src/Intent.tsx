import React from 'react';
import fp from 'lodash/fp';

const mapMessageToProps = (data: any) => data;
const Intent = (props: any): JSX.Element => <div {...props}>Intent</div>;
export default fp.compose(
  Intent,
  mapMessageToProps,
);

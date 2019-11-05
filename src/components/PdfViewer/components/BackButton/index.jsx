import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon, Button } from 'antd';

import { getBackUrl } from 'utils/urlUtil';

const Wrapper = styled.div`
  font-size: 14px;
  color: #1890ff;
  cursor: pointer;
  user-select: none;
`;

function BackButton({ isTextButton }) {
  const clickCallback = useCallback(async () => {
    const backUrl = getBackUrl();

    // window.open(backUrl, '_self');
    window.location = backUrl;
  }, []);

  const backText = (
    '返回'
  );

  if (!isTextButton) {
    return (
      <Button onClick={clickCallback} style={{ width: 126 }} type="primary">
        {backText}
      </Button>
    );
  }
  return (
    <Wrapper onClick={clickCallback}>
      <Icon type="left" style={{ marginRight: 8 }}/>
      {backText}
    </Wrapper>
  );
}
BackButton.propTypes = {
  isTextButton: PropTypes.bool.isRequired,
};

export default BackButton;

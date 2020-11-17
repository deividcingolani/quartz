import React, { FC, memo } from 'react';
import { Value } from '@logicalclocks/quartz';
// Hooks
import { useLocation } from 'react-router-dom';
// Components
import Error from '../../components/error/Error';

const Error404: FC = () => {
  const location = useLocation();

  return (
    <Error
      errorTitle="404"
      errorMessage={
        <Value mb="40px">
          No page exists for&nbsp;
          <Value as="span" primary>
            {location.pathname}
          </Value>
        </Value>
      }
    />
  );
};

export default memo(Error404);

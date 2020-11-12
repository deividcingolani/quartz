import React, { FC, memo } from 'react';
import { Button, Value } from '@logicalclocks/quartz';
// Hooks
import { useNavigate, useLocation } from 'react-router-dom';
// Components
import Error from '../../components/error/Error';

const Error401: FC = () => {
  const navigate = useNavigate();
  const history = useLocation();
  console.log(history);

  return (
    <Error
      errorCode={401}
      errorMessage={
        <Value mb="40px">Yot are not authorized to access to this data</Value>
      }
      actions={
        <Button onClick={() => navigate(-1)} mr="14px">
          Back
        </Button>
      }
    />
  );
};

export default memo(Error401);

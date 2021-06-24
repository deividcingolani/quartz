// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo } from 'react';
// Components
import Error from '../../components/error/Error';

const Error404: FC = () => {
  return <Error errorTitle="404" errorMessage="This page does not exist" />;
};

export default memo(Error404);

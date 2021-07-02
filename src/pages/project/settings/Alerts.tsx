// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo } from 'react';
// Components
import Error from '../../../components/error/Error';

const Alerts: FC = () => {
  return (
    <Error errorTitle="COMING SOON" errorMessage="Alerts page is coming soon" />
  );
};

export default memo(Alerts);

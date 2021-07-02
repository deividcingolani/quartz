// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo } from 'react';
import Loader from '../../../components/loader/Loader';
import useNavigateRelative from '../../../hooks/useNavigateRelative';

const GeneralSettings: FC = () => {
  const navigate = useNavigateRelative();
  navigate('general');
  return <Loader />;
};

export default memo(GeneralSettings);

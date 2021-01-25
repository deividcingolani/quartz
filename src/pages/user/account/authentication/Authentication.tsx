import { Flex } from 'rebass';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Dispatch, RootState } from '../../../../store';
import Loader from '../../../../components/loader/Loader';
import PasswordForm from './PasswordForm';

const Authentication: FC = () => {
  const isLoading = useSelector(
    (state: RootState) => state.loading.effects.profile.getUser,
  );

  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    dispatch.profile.getUser();
    return () => {
      dispatch.projectsList.clear();
    };
  }, [dispatch]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Flex flexDirection="column" alignItems="center">
      <PasswordForm />
    </Flex>
  );
};

export default Authentication;

// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useEffect } from 'react';
import { Flex } from 'rebass';
import { useDispatch, useSelector } from 'react-redux';

import { Dispatch, RootState } from '../../../../store';
import Loader from '../../../../components/loader/Loader';
import PasswordForm from './PasswordForm';
import useTitle from '../../../../hooks/useTitle';
import titles from '../../../../sources/titles';

const Authentication: FC = () => {
  const isLoading = useSelector(
    (state: RootState) => state.loading.effects.profile.getUser,
  );

  const dispatch = useDispatch<Dispatch>();

  useTitle(titles.accountAuth);

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

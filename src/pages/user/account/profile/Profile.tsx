import * as yup from 'yup';
import { Flex } from 'rebass';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Components
import ProfileForm from './ProfileForm';
import Loader from '../../../../components/loader/Loader';
// Types
import { Dispatch, RootState } from '../../../../store';
// Validators
import { alphanum } from '../../../../utils/validators';
import useTitle from '../../../../hooks/useTitle';
import titles from '../../../../sources/titles';

export const schema = yup.object().shape({
  name: alphanum.label('Name'),
  login: alphanum.label('Description'),
});

const Profile: FC = () => {
  useTitle(titles.accountAuth);

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
      <ProfileForm />
    </Flex>
  );
};

export default Profile;

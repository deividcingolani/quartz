import * as yup from 'yup';
import { Flex } from 'rebass';
import React, { FC, useEffect } from 'react';
import { Button } from '@logicalclocks/quartz';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Components
import ProfileForm from './ProfileForm';
import PasswordForm from './PasswordForm';
import Loader from '../../../components/loader/Loader';
// Types
import { Dispatch, RootState } from '../../../store';
// Validators
import { alphanum } from '../../../utils/validators';
import useTitle from '../../../hooks/useTitle';
import titles from '../../../sources/titles';

export const schema = yup.object().shape({
  name: alphanum.label('Name'),
  login: alphanum.label('Description'),
});

const Profile: FC = () => {
  useTitle(titles.accountAuth);

  const isLoading = useSelector(
    (state: RootState) => state.loading.effects.profile.getUser,
  );

  const navigate = useNavigate();

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
    <Flex mt="50px" flexDirection="column" alignItems="center">
      <Button
        ml="-12px"
        intent="inline"
        alignSelf="flex-start"
        onClick={() => navigate(-1)}
      >
        &#8701; back
      </Button>
      <ProfileForm />
      <PasswordForm />
    </Flex>
  );
};

export default Profile;

import React, { FC, useCallback, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Flex } from 'rebass';
import {
  Button,
  Callout,
  CalloutTypes,
  Card,
  Input,
  Value,
} from '@logicalclocks/quartz';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Hero from '../Hero';
// Validators
import { alphanum } from '../../../utils/validators';
// Utils
import getInputValidation from '../../../utils/getInputValidation';
// Types
import { Dispatch, RootState } from '../../../store';
// Components
import LoginHelp from './LoginHelp';

export const schema = yup.object().shape({
  email: alphanum.label('Email'),
  password: alphanum.label('Password'),
});

export interface AuthError {
  error: boolean;
  message: string;
}

const Login: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch>();

  const { errors, register, handleSubmit } = useForm({
    shouldUnregister: false,
    resolver: yupResolver(schema),
  });

  const [error, setError] = useState<AuthError | null>(null);

  const isLoading = useSelector(
    (state: RootState) => state.loading.effects.auth.login,
  );

  const handleLogin = useCallback(
    async (data) => {
      setError(null);
      const error = await dispatch.auth.login({
        data,
      });
      if (error) {
        setError(error);
      }
    },
    [dispatch],
  );

  return (
    <Flex
      mt="50px"
      flexDirection="column"
      alignItems="center"
      as="form"
      onSubmit={handleSubmit(handleLogin)}
    >
      <Hero />
      <Value mb="60px" mt="15px" fontFamily="Inter" fontSize="18px" primary>
        Hopsworks Feature Store
      </Value>
      {error && (
        <Box width="466px" mb="20px">
          <Callout type={CalloutTypes.error} content="Wrong credentials" />
        </Box>
      )}
      <Card width="466px" title="Login">
        <Flex flexDirection="column">
          <Input
            label="Email Address"
            labelProps={{ width: '100%' }}
            name="email"
            disabled={isLoading}
            placeholder="email"
            ref={register}
            {...getInputValidation('email', errors)}
          />
          <Input
            type="password"
            labelProps={{ width: '100%', mt: '20px' }}
            label="Password"
            name="password"
            disabled={isLoading}
            placeholder="password"
            ref={register}
            {...getInputValidation('password', errors)}
          />
          <Button
            type="submit"
            mt="20px"
            alignSelf="flex-end"
            disabled={isLoading}
          >
            Login
          </Button>
        </Flex>
      </Card>

      <Flex
        mt="20px"
        width="466px"
        height="fit-content"
        p="20px"
        justifyContent="space-between"
        backgroundColor="white"
        alignItems="center"
      >
        <Value fontFamily="Inter">The registration is enabled</Value>
        <Button intent="secondary" onClick={() => navigate('/register')}>
          Register
        </Button>
      </Flex>

      <LoginHelp />
    </Flex>
  );
};

export default Login;

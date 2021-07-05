// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useState } from 'react';
import * as yup from 'yup';
import { Box, Flex } from 'rebass';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Callout,
  CalloutTypes,
  Card,
  Input,
  Tooltip,
  TooltipPositions,
  Value,
} from '@logicalclocks/quartz';

// Validators
import { alphanum, alphanumUnlimited } from '../../../utils/validators';
// Utils
import getInputValidation from '../../../utils/getInputValidation';
// Types
import { Dispatch, RootState } from '../../../store';
// Components
import Hero from '../Hero';
import styles from './styles';
import LoginHelp from './LoginHelp';
import titles from '../../../sources/titles';
import useTitle from '../../../hooks/useTitle';
import icons from '../../../sources/icons';

export const schema = yup.object().shape({
  email: alphanumUnlimited.label('Email'),
  password: alphanum.label('Password'),
});

export interface AuthError {
  error: boolean;
  message: string;
}

const Login: FC = () => {
  useTitle(titles.login);

  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch>();

  const { errors, register, handleSubmit, watch } = useForm({
    shouldUnregister: false,
    resolver: yupResolver(schema),
  });

  const [error, setError] = useState<AuthError | null>(null);

  const [isShowPassword, setIsShow] = useState(false);

  const isLoading = useSelector(
    (state: RootState) => state.loading.effects.auth.login,
  );

  const handleLogin = useCallback(
    async (data) => {
      setError(null);

      const error = await dispatch.auth.login({
        data,
      });

      if (error?.message === 'Network Error') {
        return;
      }

      if (error) {
        setError(error);
      } else {
        dispatch.profile.getUser();
      }
    },
    [dispatch],
  );

  const { password } = watch(['password']);

  return (
    <Flex
      mt="50px"
      flexDirection="column"
      alignItems="center"
      as="form"
      autoComplete="on"
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
            autoComplete="on"
            placeholder="enter your email address"
            ref={register}
            {...getInputValidation('email', errors)}
          />
          <Input
            type={isShowPassword ? 'text' : 'password'}
            labelProps={{ width: '100%', mt: '20px' }}
            label="Password"
            name="password"
            disabled={isLoading}
            autoComplete="on"
            placeholder="••••••"
            ref={register}
            rightIcon={
              <Box
                onMouseDown={() => setIsShow(true)}
                onMouseUp={() => setIsShow(false)}
                onMouseOut={() => setIsShow(false)}
                sx={styles(isShowPassword, !password)}
              >
                <Tooltip
                  mainText="show password"
                  position={TooltipPositions.right}
                >
                  <Box>{icons.eye}</Box>
                </Tooltip>
              </Box>
            }
            {...getInputValidation('password', errors)}
          />
          <Flex mt="20px" justifyContent="space-between">
            <Button
              ml="-15px"
              alignSelf="flex-end"
              intent="inline"
              type="button"
              onClick={() => navigate('/forgot')}
            >
              Forgot password?
            </Button>
            <Button type="submit" alignSelf="flex-end" disabled={isLoading}>
              Login
            </Button>
          </Flex>
        </Flex>
      </Card>

      <Box
        sx={{
          h4: {
            fontSize: '12px',
          },
        }}
      >
        <Card
          mt="20px"
          width="466px"
          actions={
            <Button intent="secondary" onClick={() => navigate('/register')}>
              Register
            </Button>
          }
          title="Don’t have an account?"
        />
      </Box>

      <LoginHelp />
    </Flex>
  );
};

export default Login;

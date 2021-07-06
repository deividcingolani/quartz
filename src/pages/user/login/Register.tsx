// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useState } from 'react';
import * as yup from 'yup';
import { Box, Flex } from 'rebass';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  Input,
  Value,
  Button,
  Callout,
  Checkbox,
  Tooltip,
  CalloutTypes,
  TooltipPositions,
} from '@logicalclocks/quartz';

import Hero from '../Hero';
// Validators
import { alphanum, password } from '../../../utils/validators';
// Utils
import getInputValidation from '../../../utils/getInputValidation';
// Types
import { Dispatch, RootState } from '../../../store';
// Components
import Terms from './Terms';
import LoginHelp from './LoginHelp';
import styles from './styles';
import icons from '../../../sources/icons';
import RegisterSuccess from './RegisterSuccess';

export const schema = yup.object().shape({
  email: yup.string().email().required().label('Email'),
  password: password.label('Password'),
  firstName: alphanum.label('First name'),
  lastName: alphanum.label('Last name'),
});

export interface AuthError {
  error: boolean;
  message: string;
}

const Register: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch>();

  const { errors, register, handleSubmit, watch } = useForm({
    shouldUnregister: false,
    resolver: yupResolver(schema),
  });

  const [error, setError] = useState<AuthError | null>(null);

  const [isAgree, setIsAgree] = useState(false);

  const [isOpenTerms, setIsOpenTerms] = useState(false);

  const [isShowPassword, setIsShow] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);

  const isLoading = useSelector(
    (state: RootState) => state.loading.effects.auth.register,
  );

  const handleRegister = useCallback(
    async (data) => {
      setError(null);
      if (!isAgree) {
        setError({
          error: true,
          message: 'You must agree with the terms',
        });

        return;
      }

      const error = await dispatch.auth.register({
        data,
      });

      if (error?.message === 'Network Error') {
        return;
      }

      if (error?.error) {
        setError(error);
      } else {
        setIsSuccess(true);
      }
    },
    [dispatch, isAgree],
  );

  const { password } = watch(['password']);

  if (isSuccess) {
    return <RegisterSuccess onClick={() => navigate('/login')} />;
  }
  return (
    <>
      {isOpenTerms && <Terms onClose={() => setIsOpenTerms(false)} />}

      <Flex mt="50px" flexDirection="column" alignItems="center">
        <Hero />
        <Value mb="60px" mt="15px" fontFamily="Inter" fontSize="18px" primary>
          Hopsworks Feature Store
        </Value>
        {error && (
          <Box width="466px" mb="20px">
            <Callout type={CalloutTypes.error} content={error.message} />
          </Box>
        )}
        <Card width="466px" title="Register">
          <Flex flexDirection="column">
            <Flex>
              <Input
                label="First name"
                labelProps={{ width: '50%' }}
                name="firstName"
                disabled={isLoading}
                placeholder="John"
                ref={register}
                {...getInputValidation('firstName', errors)}
              />
              <Input
                labelProps={{ flex: 1, ml: '20px' }}
                label="Last name"
                name="lastName"
                disabled={isLoading}
                placeholder="Tukey"
                ref={register}
                {...getInputValidation('lastName', errors)}
              />
            </Flex>
            <Input
              label="Email Address"
              labelProps={{ width: '100%', mt: '20px' }}
              name="email"
              disabled={isLoading}
              placeholder="john@tukey.com"
              ref={register}
              {...getInputValidation('email', errors)}
            />
            <Input
              type={isShowPassword ? 'text' : 'password'}
              labelProps={{ width: '100%', mt: '20px' }}
              label="Password"
              name="password"
              disabled={isLoading}
              placeholder="•••••••"
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
            <Flex alignItems="center" mt="20px">
              <Checkbox
                checked={isAgree}
                onChange={() => setIsAgree(!isAgree)}
              />
              <Value ml="5px">I agree with</Value>
              <Button
                m="-8px"
                ml="-12px"
                intent="inline"
                onClick={() => setIsOpenTerms(true)}
              >
                the terms
              </Button>
            </Flex>
            <Button
              type="submit"
              mt="20px"
              alignSelf="flex-end"
              onClick={handleSubmit(handleRegister)}
              disabled={isLoading}
            >
              Register
            </Button>
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
              <Button intent="secondary" onClick={() => navigate('/login')}>
                Login
              </Button>
            }
            title="Already have an account?"
          />
        </Box>

        <LoginHelp />
      </Flex>
    </>
  );
};

export default Register;

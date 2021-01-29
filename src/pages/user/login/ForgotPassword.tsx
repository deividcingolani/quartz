import * as yup from 'yup';
import { Box, Flex } from 'rebass';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { FC, useCallback, useState } from 'react';
import {
  Card,
  Input,
  Value,
  Button,
  Callout,
  Labeling,
  CalloutTypes,
} from '@logicalclocks/quartz';

// Components
import Hero from '../Hero';
// Utils
import getInputValidation from '../../../utils/getInputValidation';
// Types
import { Dispatch } from '../../../store';

export const schema = yup.object().shape({
  email: yup.string().email().required().label('Email'),
});

const ForgotPassword: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch>();

  const { errors, register, handleSubmit, watch } = useForm({
    shouldUnregister: false,
    resolver: yupResolver(schema),
  });

  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');

  const [error, setError] = useState(false);

  const handleSend = useCallback(
    async ({ email }) => {
      setError(false);
      const error = await dispatch.auth.recoverPassword({
        data: email,
      });

      if (error) {
        setError(true);
      } else {
        setEmail(email);
        setSent(true);
      }
    },
    [dispatch],
  );

  const { email: emailData } = watch(['email']);

  return (
    <Flex
      mt="50px"
      flexDirection="column"
      alignItems="center"
      as="form"
      onSubmit={handleSubmit(handleSend)}
    >
      <Hero />
      <Value mb="60px" mt="15px" fontFamily="Inter" fontSize="18px" primary>
        Hopsworks Feature Store
      </Value>
      {error && (
        <Box width="466px" mb="20px">
          <Callout type={CalloutTypes.error} content="Incorrect email" />
        </Box>
      )}
      <Card width="466px" title="Reset password">
        {sent && (
          <>
            <Flex flexDirection="column">
              <Value>Done</Value>
              <Flex mt="8px">
                <Labeling>An email has been sent to</Labeling>
                <Button m="-8px" ml="-12px" intent="inline">
                  {email}
                </Button>
              </Flex>
            </Flex>
            <Flex justifyContent="flex-end" mt="20px">
              <Button intent="secondary" onClick={() => navigate('/login')}>
                Login
              </Button>
            </Flex>
          </>
        )}
        {!sent && (
          <>
            <Input
              label="Email Address"
              labelProps={{ width: '100%' }}
              name="email"
              placeholder="email"
              ref={register}
              {...getInputValidation('email', errors)}
            />
            <Flex justifyContent="flex-end" mt="20px">
              <Button
                mr="20px"
                intent="secondary"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button disabled={!emailData} type="submit">
                Send reset link
              </Button>
            </Flex>
          </>
        )}
      </Card>
    </Flex>
  );
};

export default ForgotPassword;

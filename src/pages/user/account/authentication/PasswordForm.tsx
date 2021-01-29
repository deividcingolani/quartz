import * as yup from 'yup';
import { Box, Flex } from 'rebass';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import React, { FC, useCallback, useState } from 'react';
import {
  Card,
  Input,
  Button,
  Callout,
  CalloutTypes,
  NotificationsManager,
} from '@logicalclocks/quartz';

// Components
import NotificationBadge from '../../../../utils/notifications/notificationBadge';
import NotificationContent from '../../../../utils/notifications/notificationValue';
// Utils
import getInputValidation from '../../../../utils/getInputValidation';
// Types
import { AuthError } from '../../login/Login';
import { Dispatch, RootState } from '../../../../store';
// Validators
import { alphanum, password } from '../../../../utils/validators';

export const schema = yup.object().shape({
  oldPassword: alphanum.label('Old Password'),
  newPassword: password.label('Password'),
  confirmedPassword: yup
    .string()
    .equals([yup.ref('newPassword')], 'Passwords must match'),
});

const PasswordForm: FC = () => {
  const isLoading = useSelector(
    (state: RootState) => state.loading.effects.auth.updatePassword,
  );

  const [error, setError] = useState<AuthError | null>(null);

  const dispatch = useDispatch<Dispatch>();

  const { errors, register, handleSubmit } = useForm({
    shouldUnregister: false,
    resolver: yupResolver(schema),
  });

  const handleUpdate = useCallback(
    async (data) => {
      setError(null);
      const error = await dispatch.auth.updatePassword({
        data,
      });
      if (error) {
        setError(error);
      } else {
        NotificationsManager.create({
          isError: false,
          type: (
            <NotificationBadge message="password updated" variant="success" />
          ),
          content: (
            <NotificationContent message="Your password has been successfully updated" />
          ),
        });
      }
    },
    [dispatch],
  );

  return (
    <>
      {error && (
        <Box mb="10px" width="100%">
          <Callout type={CalloutTypes.error} content={error.message} />
        </Box>
      )}
      <Card width="100%" title="Update password">
        <Flex flexDirection="column">
          <Input
            label="Current Password"
            type="password"
            name="oldPassword"
            labelProps={{ mr: '20px' }}
            disabled={isLoading}
            placeholder="••••••"
            ref={register}
            {...getInputValidation('oldPassword', errors)}
          />
          <Flex mt="30px">
            <Input
              label="New password"
              type="password"
              name="newPassword"
              labelProps={{ mr: '20px' }}
              disabled={isLoading}
              placeholder="••••••"
              ref={register}
              {...getInputValidation('newPassword', errors)}
            />
            <Input
              label="Confirm new password"
              name="confirmedPassword"
              type="password"
              disabled={isLoading}
              placeholder="••••••"
              ref={register}
              {...getInputValidation('confirmedPassword', errors)}
            />
          </Flex>
          <Button
            disabled={isLoading}
            onClick={handleSubmit(handleUpdate)}
            mt="20px"
            alignSelf="flex-end"
          >
            Update password
          </Button>
        </Flex>
      </Card>
    </>
  );
};

export default PasswordForm;

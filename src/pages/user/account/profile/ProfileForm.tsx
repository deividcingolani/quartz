import * as yup from 'yup';
import { Box, Flex } from 'rebass';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import React, { FC, useCallback, useState } from 'react';
import {
  Button,
  Callout,
  CalloutTypes,
  Card,
  Input,
  Label,
  Labeling,
  Microlabeling,
  NotificationsManager,
  User,
  Value,
} from '@logicalclocks/quartz';

// Validators
import getInputValidation from '../../../../utils/getInputValidation';
// Types
import { Dispatch, RootState } from '../../../../store';
import { AuthError } from '../../login/Login';
// Utils
import { shortRequiredText, shortText } from '../../../../utils/validators';
// Services
import ProfileService from '../../../../services/ProfileService';
// Components
import NotificationBadge from '../../../../utils/notifications/notificationBadge';
import NotificationContent from '../../../../utils/notifications/notificationValue';

export const schema = yup.object().shape({
  firstname: shortRequiredText.label('First name'),
  lastname: shortRequiredText.label('Last name'),
  phoneNumber: shortText.label('Phone Number'),
});

const ProfileForm: FC = () => {
  const dispatch = useDispatch<Dispatch>();

  const isLoading = useSelector(
    (state: RootState) => state.loading.effects.auth.updateData,
  );

  const user = useSelector((state: RootState) => state.profile);

  const [error, setError] = useState<AuthError | null>(null);

  const { errors, register, handleSubmit } = useForm({
    defaultValues: {
      firstname: user.firstname,
      lastname: user.lastname,
      phoneNumber: user.phoneNumber,
    },
    shouldUnregister: false,
    resolver: yupResolver(schema),
  });

  const handleSave = useCallback(
    async (data) => {
      setError(null);
      const error = await dispatch.auth.updateData({
        data,
      });
      if (error) {
        setError(error);
      } else {
        NotificationsManager.create({
          isError: false,
          type: <NotificationBadge message="info updated" variant="success" />,
          content: (
            <NotificationContent message="Your information has been successfully updated" />
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
      <Card width="100%" title="Edit profile">
        <Flex flexDirection="column">
          <Flex>
            <User
              name={user.firstname}
              photo={ProfileService.avatar(user.email)}
            />
            <Flex mt="3px" flexDirection="column" ml="20px">
              <Microlabeling mb="3px" gray>
                Username
              </Microlabeling>
              <Value primary>{user.firstname}</Value>
            </Flex>
            <Flex mt="3px" flexDirection="column" ml="20px">
              <Microlabeling mb="3px" gray>
                Email
              </Microlabeling>
              <Value primary>{user.email}</Value>
            </Flex>
          </Flex>
          <Flex mt="30px">
            <Input
              label="First name"
              name="firstname"
              labelProps={{ mr: '20px' }}
              disabled={isLoading}
              placeholder="First name"
              ref={register}
              {...getInputValidation('firstname', errors)}
            />
            <Input
              label="Last name"
              name="lastname"
              disabled={isLoading}
              labelProps={{ mr: '20px' }}
              placeholder="Last name"
              ref={register}
              {...getInputValidation('lastname', errors)}
            />
            <Label>
              <Flex>
                Phone number
                <Labeling ml="5px" gray>
                  (optional)
                </Labeling>
              </Flex>
              <Input
                label=""
                mt="8px"
                name="phoneNumber"
                disabled={isLoading}
                placeholder="+46 12-345 67 89"
                ref={register}
                {...getInputValidation('phoneNumber', errors)}
              />
            </Label>
          </Flex>
          <Button
            disabled={isLoading}
            onClick={handleSubmit(handleSave)}
            mt="20px"
            alignSelf="flex-end"
          >
            Save
          </Button>
        </Flex>
      </Card>
    </>
  );
};

export default ProfileForm;

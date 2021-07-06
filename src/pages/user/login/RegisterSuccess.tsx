// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC } from 'react';
import { Button, Label, Labeling, Value } from '@logicalclocks/quartz';
import { Card, Flex } from 'rebass';
import Hero from '../Hero';

export interface RegisterSuccessProps {
  onClick: () => void;
}

const RegisterSuccess: FC<RegisterSuccessProps> = ({ onClick }) => (
  <>
    <Flex mt="50px" flexDirection="column" alignItems="center">
      <Hero />
      <Value mb="60px" mt="15px" fontFamily="Inter" fontSize="18px" primary>
        Hopsworks Feature Store
      </Value>

      <Card width="466px">
        <Flex p="20px" flexDirection="column">
          <Label mb="20px" fontSize="18px">
            Waiting for validation
          </Label>
          <Value>Account created</Value>
          <Labeling mt="8px">
            Your account is created. A cluster admin must validate your account
            before you can log in
          </Labeling>
        </Flex>
        <Flex p="20px" bg="grayShade3" justifyContent="flex-end">
          <Button onClick={onClick} intent="secondary">
            Login
          </Button>
        </Flex>
      </Card>
    </Flex>
  </>
);

export default RegisterSuccess;

// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC } from 'react';
import { Button, Labeling, Value, Card } from '@logicalclocks/quartz';
import { Flex } from 'rebass';
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
      <Card width="466px" title="Waiting for validation">
        <Flex flexDirection="column">
          <Value>Account created</Value>
          <Labeling mt="8px" mb="15px">
            Your account is created. A cluster admin must validate your account
            before you can log in.
          </Labeling>
          <Button onClick={onClick} intent="secondary" alignSelf="flex-end">
            Login
          </Button>
        </Flex>
      </Card>
    </Flex>
  </>
);

export default RegisterSuccess;

import { Flex } from 'rebass';
import React, { FC } from 'react';
import { Button, Card, Value } from '@logicalclocks/quartz';

const LoginHelp: FC = () => (
  <Card
    mt="20px"
    width="466px"
    actions={
      <Flex width="466px" height="fit-content" alignItems="center">
        <Value fontFamily="Inter">Need help? Check out our</Value>
        <Button
          onClick={() => window.open('https://docs.hopsworks.ai', '_blank')}
          px="4px"
          intent="inline"
        >
          documentation
        </Button>
        <Value fontFamily="Inter">or</Value>
        <Button
          onClick={() =>
            window.open('https://community.hopsworks.ai/', '_blank')
          }
          pl="4px"
          intent="inline"
        >
          contact us
        </Button>
      </Flex>
    }
  />
);

export default LoginHelp;

import { Flex } from 'rebass';
import React, { FC } from 'react';
import { Button, Value } from '@logicalclocks/quartz';

const LoginHelp: FC = () => (
  <Flex
    mt="20px"
    width="466px"
    height="fit-content"
    p="20px"
    backgroundColor="white"
    alignItems="center"
  >
    <Value fontFamily="Inter">Need help? Check out our</Value>
    <Button
      onClick={() =>
        window.open(
          'https://hopsworks.readthedocs.io/en/stable/admin_guide/user-administration.html',
          '_blank',
        )
      }
      px="4px"
      intent="inline"
    >
      documentation
    </Button>
    <Value fontFamily="Inter">or</Value>
    <Button
      onClick={() => window.open('https://community.hopsworks.ai/', '_blank')}
      pl="4px"
      intent="inline"
    >
      contact us
    </Button>
  </Flex>
);

export default LoginHelp;

import React, { FC, memo, useCallback } from 'react';
import { Button, Value } from '@logicalclocks/quartz';
import { Flex } from 'rebass';

const Error404: FC = () => {
  const reloadHandler = useCallback(() => window.location.reload(), [window]);

  return (
    <Flex flexDirection="column" alignItems="center" my="auto">
      <Value fontSize="22px" mb="11px">
        Connection Error
      </Value>
      <Value mb="40px">Cannot reach the server</Value>
      <Flex>
        <Button intent="secondary" onClick={reloadHandler} mr="14px">
          Reload
        </Button>
      </Flex>
    </Flex>
  );
};

export default memo(Error404);

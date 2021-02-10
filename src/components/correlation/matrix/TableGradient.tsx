import React, { FC } from 'react';
import { Box, Flex } from 'rebass';
import { Label } from '@logicalclocks/quartz';

const numbers = [-1, -0.5, 0, 0.5, 1];

const TableGradient: FC = () => {
  return (
    <Flex flexDirection="column">
      <Box
        sx={{
          width: '100%',
          height: '8px',

          background:
            'linear-gradient(90deg, #4F7E92 0%, #F2F2F2 50%, #B76046 100%)',
        }}
      />
      <Flex mt="5px" justifyContent="space-between">
        {numbers.map((number) => (
          <Label key={number} sx={{ fontWeight: 500 }}>
            {number}
          </Label>
        ))}
      </Flex>
    </Flex>
  );
};

export default TableGradient;

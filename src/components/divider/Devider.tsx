import React, { FC } from 'react';
import { Box } from 'rebass';

export interface DividerProps {
  mt?: string;
  mb?: string;
  mr?: string;
  ml?: string;
}

const Divider: FC<DividerProps> = ({
  mb = '0',
  ml = '0',
  mr = '0',
  mt = '0',
}) => (
  <Box
    mb={mb}
    mt={mt}
    mr={mr}
    ml={ml}
    style={{ borderBottom: '2px solid #F5F5F5' }}
    height="1px"
    width="105%"
  />
);

export default Divider;

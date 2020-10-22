import React, { FC } from 'react';
import { Box, SxStyleProp } from 'rebass';
import { useNavigation, Logo } from '@logicalclocks/quartz';

import { version } from '../../../../package.json';

const boxOpenStyles: SxStyleProp = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '50px',
};

const boxCollapsedStyles = {
  ...boxOpenStyles,
  width: undefined,
  mx: '40px',
};

const Footer: FC = () => {
  const { isOpen } = useNavigation();

  if (isOpen) {
    return (
      <Box sx={boxOpenStyles}>
        <Logo />
        <span>HFS</span>
        <span>V {version}</span>
      </Box>
    );
  }

  return (
    <Box sx={boxCollapsedStyles}>
      <Logo />
      <span>Hopsworks Feature Store version {version}</span>
    </Box>
  );
};

export default Footer;

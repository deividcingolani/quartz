import { Logo } from '@logicalclocks/quartz';
import React, { FC } from 'react';
import { Box, BoxProps } from 'rebass';

// Styles
import styles from './loader-styles';

export interface LoaderProps extends Omit<BoxProps, 'css'> {
  width?: number;
  height?: number;
}

const Loader: FC<LoaderProps> = ({
  width = 44,
  height = 44,
  ...props
}: LoaderProps) => {
  const { sx, ...restProps } = props;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    // @ts-ignore
    <Box sx={{ ...styles, ...sx }} {...restProps}>
      <Logo width={width} height={height} />
    </Box>
  );
};

export default Loader;

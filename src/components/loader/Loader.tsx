// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC } from 'react';
import { Logo } from '@logicalclocks/quartz';
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Box sx={{ ...styles, ...sx }} {...restProps}>
      <Logo width={width} height={height} />
    </Box>
  );
};

export default Loader;

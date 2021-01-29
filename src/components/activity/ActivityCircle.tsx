import { Box, BoxProps } from 'rebass';
import React, { FC, useMemo } from 'react';

export interface ActivityCircleProps extends Omit<BoxProps, 'css'> {
  color: string;
  percent: number;
}

const maxSize = 32;
const minSize = 1;

const ActivityCircle: FC<ActivityCircleProps> = ({
  color,
  percent,
  ...props
}) => {
  const diameter = useMemo(() => {
    return `${Math.ceil(minSize + (maxSize - minSize) * (percent / 100))}px`;
  }, [percent]);

  return (
    <Box
      {...props}
      sx={{
        width: diameter,
        height: diameter,
        borderRadius: '50%',
        border: `1px solid ${color}`,
      }}
    />
  );
};

export default ActivityCircle;

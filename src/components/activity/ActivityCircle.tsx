import React, { FC, useMemo } from 'react';
import { Box, BoxProps } from 'rebass';

export interface ActivityCircleProps extends Omit<BoxProps, 'css'> {
  rowsUpdated: number;
  rowsDeleted: number;
  rowsInserted: number;
  allRowsCount: number;
}

const ActivityCircle: FC<ActivityCircleProps> = ({
  rowsDeleted,
  rowsInserted,
  rowsUpdated,
  allRowsCount,
  ...props
}) => {
  const deletedPercent = useMemo(() => {
    return Math.ceil((rowsDeleted / allRowsCount) * 100);
  }, [allRowsCount, rowsDeleted]);

  const updatedPercent = useMemo(() => {
    return deletedPercent + Math.ceil((rowsUpdated / allRowsCount) * 100);
  }, [allRowsCount, rowsUpdated, deletedPercent]);

  return (
    <Box {...props}>
      <svg width="22px" height="22px" viewBox="-5 -5 45 45">
        <path
          d="M18 2.0845
      a 15.9155 15.9155 0 0 1 0 31.831
      a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#21B182"
          strokeWidth="7"
          strokeDasharray="100, 100"
        />
        <path
          d="M18 2.0845
      a 15.9155 15.9155 0 0 1 0 31.831
      a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#F2994A"
          strokeWidth="7"
          strokeDasharray={`${updatedPercent}, 100`}
        />
        <path
          d="M18 2.0845
      a 15.9155 15.9155 0 0 1 0 31.831
      a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#EB5757"
          strokeWidth="7"
          strokeDasharray={`${deletedPercent}, 100`}
        />
      </svg>
    </Box>
  );
};

export default ActivityCircle;

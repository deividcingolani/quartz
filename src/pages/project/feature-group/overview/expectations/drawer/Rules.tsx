import { Box } from 'rebass';
import { Row } from '@logicalclocks/quartz';
import React, { ComponentType, FC } from 'react';
import useRulesListRowData from './useRulesListRowData';
import { Expectation } from '../../../../../../types/expectation';

const Rules: FC<{ expectation: Expectation }> = ({
  expectation,
}: {
  expectation: Expectation;
}) => {
  const [components, props] = useRulesListRowData(expectation);

  return (
    <Box
      sx={{
        borderRightStyle: 'solid',
        borderRightWidth: '1px',
        borderLeftStyle: 'solid',
        borderLeftWidth: '1px',
        borderColor: 'grayShade2',
        width: '100%',

        table: {
          td: {
            pl: '10px !important',
            pr: '14px !important',
            whiteSpace: 'nowrap',
          },
        },
      }}
    >
      <Row
        middleColumn={0}
        groupComponents={components as ComponentType<any>[][]}
        groupProps={props}
      />
    </Box>
  );
};

export default Rules;

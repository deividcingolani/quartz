import React, { FC, useMemo } from 'react';
import { Box, Flex } from 'rebass';
import { useSelector } from 'react-redux';
import { Value } from '@logicalclocks/quartz';

// Components
import Loader from '../../../../components/loader/Loader';
// Types
import { RootState } from '../../../../store';
import randomArrayString from '../../../../utils/randomArrayString';

export interface StatisticsRowsProps {
  featureName: string;
}

const styles = {
  container: {
    position: 'relative',

    bg: 'white',

    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: 'gray',

    boxSizing: 'border-box',

    overflow: 'hidden',
  },
  row: {
    pl: '5px',

    lineHeight: '30px',

    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    borderBottomColor: 'grayShade1',
  },
};

const StatisticsRows: FC<StatisticsRowsProps> = ({ featureName }) => {
  const data = useSelector(
    (state: RootState) => state.featureGroupRows[featureName],
  );

  const isLoading = useSelector(
    (state: RootState) => state.loading.effects.featureGroupRows.fetch,
  );

  const keys = useMemo(() => randomArrayString(data?.length), [data]);

  if (!isLoading && !data) {
    return null;
  }

  return (
    <Flex flexDirection="column" mt="auto" ml="auto">
      <Box
        ml="11px"
        width="249px"
        height="171px"
        overflow="auto"
        sx={styles.container}
      >
        {isLoading && <Loader />}
        {!isLoading &&
          data.map((value, index) => {
            return (
              <Value
                key={keys[index]}
                width="max-content"
                minWidth="100%"
                sx={styles.row}
              >
                {value}
              </Value>
            );
          })}
      </Box>
      <Flex mt="20px" justifyContent="center">
        <Value primary px="5px">
          {data?.length || 0}
        </Value>
        <Value>first rows</Value>
      </Flex>
    </Flex>
  );
};

export default StatisticsRows;

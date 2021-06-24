// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useMemo, useState } from 'react';
import { Box, Flex } from 'rebass';
import { useDispatch, useSelector } from 'react-redux';
import { Value, Button } from '@logicalclocks/quartz';

// Components
import Loader from '../../../../components/loader/Loader';
// Types
import { Dispatch, RootState } from '../../../../store';
import randomArrayString from '../../../../utils/randomArrayString';

export interface StatisticsRowsProps {
  featureName: string;
  isDrawer?: boolean;
  fgId: number;
  projectId: number;
  featureStoreId: number;
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

const StatisticsRows: FC<StatisticsRowsProps> = ({
  featureName,
  isDrawer,
  featureStoreId,
  fgId,
  projectId,
}) => {
  const data = useSelector(
    (state: RootState) => state.featureGroupRows[featureName],
  );
  const [isLoaded, setIsLoaded] = useState(false);

  const isLoading = useSelector(
    (state: RootState) => state.loading.effects.featureGroupRows.fetch,
  );

  const keys = useMemo(() => randomArrayString(data?.length), [data]);

  const dispatch = useDispatch<Dispatch>();

  if (!isLoading && !data && isLoaded) {
    return null;
  }

  if (!data && !isLoading) {
    return (
      <Flex
        justifyContent="center"
        width={isDrawer ? '100%' : 'calc((100% - 60px) / 4)'}
      >
        <Button
          onClick={() => {
            dispatch.featureGroupRows.fetch({
              projectId,
              featureStoreId,
              featureGroupId: fgId,
            });
            setIsLoaded(true);
          }}
          intent="secondary"
        >
          Preview data
        </Button>
      </Flex>
    );
  }

  return (
    <Flex
      flexDirection="column"
      width={isDrawer ? '100%' : 'calc((100% - 60px) / 4)'}
    >
      <Box height="205px" overflow="auto" sx={styles.container}>
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

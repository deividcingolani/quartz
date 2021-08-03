// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { ComponentType, FC, memo } from 'react';
import { Box, Flex } from 'rebass';
import {
  Row as QRow,
  Card,
  Input,
  ToggleButton,
  Select,
  Button,
  Value,
} from '@logicalclocks/quartz';

// Hooks
import useTdFeatureListRowData from './useTdFeatureListRowData';
import useGetHrefForRoute from '../../../../hooks/useGetHrefForRoute';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import useTdFeatureFilter, { TdKeyFilters } from '../hooks/useTdFeatureFilters';

import { TrainingDataset } from '../../../../types/training-dataset';
import featureListStyles from '../../feature-group/overview/feature-lists-styles';

export interface TrainingDatasetFeatureListProps {
  data: TrainingDataset;
}

const Row = memo(QRow);

const TrainingDatasetFeatureList: FC<TrainingDatasetFeatureListProps> = ({
  data,
}) => {
  const {
    dataFiltered,
    types,
    fgFilterOptions,
    search,
    typeFilters,
    fgFilters,
    keyFilter,
    onTypeFiltersChange,
    onFgFiltersChange,
    onSearchChange,
    onToggleKey,
    onReset,
  } = useTdFeatureFilter(data.features);

  const [groupComponents, groupProps] = useTdFeatureListRowData(dataFiltered);

  const navigate = useNavigateRelative();

  const getHref = useGetHrefForRoute();

  return (
    <Card
      mt="20px"
      title="Feature list"
      actions={
        data.statisticsConfig.enabled && (
          <Button
            p={0}
            intent="inline"
            href={getHref('/statistics', '/p/:id/fs/:fsId/td/:tdId/*')}
            onClick={() =>
              navigate('/statistics', '/p/:id/fs/:fsId/td/:tdId/*')
            }
          >
            inspect data
          </Button>
        )
      }
      contentProps={{ overflow: 'auto', pb: 0 }}
      maxHeight="400px"
    >
      <Flex>
        <Input
          value={search}
          icon="search"
          placeholder="Find feature"
          onChange={onSearchChange}
        />
        <Select
          maxWidth="180px"
          width="max-content"
          ml="15px"
          isMulti
          value={typeFilters}
          options={types}
          placeholder="type"
          noDataMessage="type"
          onChange={onTypeFiltersChange}
        />
        <Select
          maxWidth="180px"
          width="max-content"
          ml="15px"
          isMulti
          value={fgFilters}
          options={fgFilterOptions}
          noDataMessage="feature group"
          placeholder="feature group"
          onChange={onFgFiltersChange}
        />
        <ToggleButton
          ml="15px"
          checked={keyFilter === TdKeyFilters.label}
          onChange={onToggleKey(TdKeyFilters.label)}
        >
          target feature only
        </ToggleButton>
      </Flex>

      {dataFiltered.length ? (
        <Box mt="30px" mx="-20px" sx={featureListStyles}>
          <Row
            middleColumn={3}
            groupComponents={groupComponents as ComponentType<any>[][]}
            groupProps={groupProps}
          />
        </Box>
      ) : (
        <Flex mt="40px" mb="40px" flexDirection="column" alignItems="center">
          <Value fontSize="18px">No match with the filters</Value>
          <Button mt="20px" onClick={onReset}>
            Reset filters
          </Button>
        </Flex>
      )}
    </Card>
  );
};

export default memo(TrainingDatasetFeatureList);

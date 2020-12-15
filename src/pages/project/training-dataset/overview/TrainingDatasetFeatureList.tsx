import { Box, Flex } from 'rebass';
import React, { ComponentType, FC, memo } from 'react';
import {
  Row as QRow,
  Card,
  Input,
  ToggleButton,
  Select,
} from '@logicalclocks/quartz';
import useTdFeatureListRowData from './useTdFeatureListRowData';
import featureListStyles from '../../feature-group/overview/feature-lists-styles';
import useTdFeatureFilter, { TdKeyFilters } from '../hooks/useTdFeatureFilters';
import { Feature } from '../../../../types/feature-group';

export interface TrainingDatasetFeatureListProps {
  data: Feature[];
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
  } = useTdFeatureFilter(data);

  const [groupComponents, groupProps] = useTdFeatureListRowData(dataFiltered);

  return (
    <Card mt="20px" title="Feature list">
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
      {/* Data Rows */}
      <Box mt="30px" mx="-20px" sx={featureListStyles}>
        <Row
          middleColumn={2}
          groupComponents={groupComponents as ComponentType<any>[][]}
          groupProps={groupProps}
        />
      </Box>
    </Card>
  );
};

export default memo(TrainingDatasetFeatureList);

import { Box, Flex } from 'rebass';
import React, { ComponentType, FC, memo } from 'react';
import {
  Row,
  Card,
  Input,
  Button,
  Select,
  ToggleButton,
} from '@logicalclocks/quartz';

// Types
import { FeatureGroup } from '../../../../types/feature-group';
// Hooks
import useFeatureFilter, { KeyFilters } from '../hooks/useFeatureFilters';
import useFeatureListRowData from './useFeatureListRowData';
// Styles
import featureListStyles from './feature-lists-styles';
import icons from '../../../../sources/icons';

export interface FeatureListProps {
  data: FeatureGroup;
}

const FeatureList: FC<FeatureListProps> = ({ data }) => {
  const {
    dataFiltered,
    types,
    search,
    typeFilters,
    keyFilter,
    onTypeFiltersChange,
    onSearchChange,
    onToggleKey,
  } = useFeatureFilter(data.features);

  const [groupComponents, groupProps] = useFeatureListRowData(
    dataFiltered,
    data,
  );

  return (
    <Card
      mt="20px"
      title="Feature list"
      actions={
        <Button p={0} intent="inline">
          inspect data
        </Button>
      }
      contentProps={{ overflow: 'auto', pb: 0 }}
      maxHeight="400px"
    >
      {/* Filters */}
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
          onChange={onTypeFiltersChange}
        />
        <ToggleButton
          ml="15px"
          sx={{
            textAlign: 'center',
          }}
          checked={keyFilter === KeyFilters.primary}
          onChange={onToggleKey(KeyFilters.primary)}
        >
          <Box
            p="0 !important"
            ml="-8px"
            mr="3px"
            sx={{
              svg: {
                width: '15px',
                height: '15px',
              },
            }}
          >
            {icons.primary}
          </Box>
          Primary Keys Only
        </ToggleButton>
        <ToggleButton
          ml="15px"
          sx={{
            textAlign: 'center',
          }}
          checked={keyFilter === KeyFilters.partition}
          onChange={onToggleKey(KeyFilters.partition)}
        >
          <Box
            p="0 !important"
            ml="-8px"
            mr="3px"
            sx={{
              svg: {
                width: '15px',
                height: '15px',
              },
            }}
          >
            {icons.partition}
          </Box>
          Partition Keys Only
        </ToggleButton>
      </Flex>

      {/* Data Rows */}
      <Box mt="30px" mx="-19px" sx={featureListStyles}>
        <Row
          middleColumn={2}
          groupComponents={groupComponents as ComponentType<any>[][]}
          groupProps={groupProps}
        />
      </Box>
    </Card>
  );
};

export default memo(FeatureList);

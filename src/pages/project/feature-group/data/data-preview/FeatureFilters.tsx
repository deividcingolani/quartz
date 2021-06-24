import React, { FC } from 'react';
import { Box, Flex } from 'rebass';
import { Input, RadioGroup, Select, ToggleButton } from '@logicalclocks/quartz';

// Hooks
import { KeyFilters } from '../../hooks/useFeatureFilters';
// Types
import { StorageConnectorType } from '../../../../../types/feature-group-data-preview';
import { Feature } from '../../../../../types/feature';
import sort, {
  SortFunc,
  SortDirection as direction,
} from '../../../../../utils/sort';
import icons from '../../../../../sources/icons';

export const sortKeys: {
  [key: string]: [keyof Feature, SortFunc<any>, direction] | undefined;
} = {
  'name (A -> Z)': ['name', sort.string, direction.asc],
  'name (Z -> A)': ['name', sort.string, direction.desc],
};

export interface FeatureFiltersProps {
  search: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  typeFilters: string[];
  onTypeFiltersChange: (filters: string[]) => void;
  types: string[];
  onToggleKey: (key: KeyFilters) => () => void;
  keyFilter: KeyFilters;
  storageConnectorType: StorageConnectorType;
  enableStorageConnectorFilter: boolean;
  setType: React.Dispatch<React.SetStateAction<StorageConnectorType>>;
  sortKey: string;
  setSortKey: React.Dispatch<React.SetStateAction<string[]>>;
}

const FeatureFilters: FC<FeatureFiltersProps> = ({
  search,
  onSearchChange,
  typeFilters,
  onTypeFiltersChange,
  types,
  onToggleKey,
  keyFilter,
  storageConnectorType,
  enableStorageConnectorFilter,
  setType,
  sortKey,
  setSortKey,
}) => {
  return (
    <Flex
      mt="67px"
      width="100%"
      height="100%"
      flexDirection="column"
      alignItems="center"
    >
      <Flex width="100%">
        <Input
          variant="white"
          value={search}
          icon="search"
          placeholder="Find feature"
          onChange={onSearchChange}
        />
        <Select
          maxWidth="180px"
          width="max-content"
          ml="15px"
          variant="white"
          isMulti
          value={typeFilters}
          options={types}
          placeholder="type"
          onChange={onTypeFiltersChange}
          noDataMessage="type all"
        />
        <Box
          sx={{
            label: {
              div: {
                backgroundColor: '#ffffff',
              },
              'div:hover': {
                div: {
                  backgroundColor: '#f5f5f5',
                  borderColor: 'transparent',
                },
              },
            },
          }}
        >
          <ToggleButton
            ml="15px"
            sx={{
              textAlign: 'center',
            }}
            height="35px"
            checked={keyFilter === KeyFilters.primary}
            onChange={onToggleKey(KeyFilters.primary)}
          >
            <Box
              p="0 !important"
              ml="-10px"
              mr="4px"
              mt="-3px"
              sx={{
                svg: {
                  width: '20px',
                  height: '20px',
                },
              }}
            >
              {icons.primary}
            </Box>
            Primary Keys Only
          </ToggleButton>
        </Box>
        <Box
          sx={{
            label: {
              div: {
                backgroundColor: '#ffffff',
              },
              'div:hover': {
                div: {
                  backgroundColor: '#f5f5f5',
                  borderColor: 'transparent',
                },
              },
            },
          }}
        >
          <ToggleButton
            ml="15px"
            sx={{
              textAlign: 'center',
              backgroundColor: '#ffffff',
            }}
            height="35px"
            checked={keyFilter === KeyFilters.partition}
            onChange={onToggleKey(KeyFilters.partition)}
          >
            <Box
              p="0 !important"
              ml="-10px"
              mr="4px"
              mt="-3px"
              sx={{
                svg: {
                  width: '20px',
                  height: '20px',
                },
              }}
            >
              {icons.partition}
            </Box>
            Partition Keys Only
          </ToggleButton>
        </Box>
        {enableStorageConnectorFilter ? (
          <Flex ml="20px" alignItems="center">
            <RadioGroup
              value={storageConnectorType}
              options={Object.values(StorageConnectorType)}
              onChange={(val) => setType(val as StorageConnectorType)}
              flexDirection="row"
              mr="10px"
            />
          </Flex>
        ) : null}
        <Select
          width="max-content"
          variant="white"
          value={[sortKey]}
          ml="auto"
          options={Object.keys(sortKeys)}
          placeholder="sort by"
          onChange={setSortKey}
        />
      </Flex>
    </Flex>
  );
};

export default FeatureFilters;

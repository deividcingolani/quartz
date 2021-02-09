import React, { FC } from 'react';
import { Flex } from 'rebass';
import {
  Icon,
  Input,
  RadioGroup,
  Select,
  ToggleButton,
} from '@logicalclocks/quartz';

// Hooks
import { KeyFilters } from '../../hooks/useFeatureFilters';
// Types
import { StorageConnectorType } from '../../../../../types/feature-group-data-preview';
import { Feature } from '../../../../../types/feature-group';
import sort, { SortFunc } from '../../../../../utils/sort';

export const sortKeys: {
  [key: string]: [keyof Feature, SortFunc<any>] | undefined;
} = {
  name: ['name', sort.string],
  'default order': undefined,
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
        <ToggleButton
          ml="15px"
          variant="white"
          checked={keyFilter === KeyFilters.primary}
          onChange={onToggleKey(KeyFilters.primary)}
        >
          <Icon icon="star" mr="8px" mt="-1px" size="xs" /> Primary Keys Only
        </ToggleButton>
        <ToggleButton
          ml="15px"
          variant="white"
          checked={keyFilter === KeyFilters.partition}
          onChange={onToggleKey(KeyFilters.partition)}
        >
          <Icon icon="grip-lines" mr="8px" mt="-1px" size="xs" /> Partition Keys
          Only
        </ToggleButton>
        <Flex ml="20px" alignItems="center">
          <RadioGroup
            value={storageConnectorType}
            options={Object.values(StorageConnectorType)}
            onChange={(val) => setType(val as StorageConnectorType)}
            flexDirection="row"
            mr="10px"
          />
        </Flex>
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

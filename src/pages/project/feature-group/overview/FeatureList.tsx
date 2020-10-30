import { Box, Flex } from 'rebass';
import React, {
  ComponentType,
  FC,
  memo,
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  Row as QRow,
  Card,
  Input,
  Button,
  Select,
  ToggleButton,
} from '@logicalclocks/quartz';

// Types
import { Feature } from '../../../../types/feature-group';
// Utils
import filterByAttribute from './utils';
import useFeatureListRowData from './useFeatureListRowData';
// Styles
import featureListStyles from './feature-lists-styles';

export interface FeatureListProps {
  data: Feature[];
}

enum KeyFilters {
  'primary',
  'partition',
  null,
}

const Row = memo(QRow);

const FeatureList: FC<FeatureListProps> = ({ data }) => {
  // State
  const [search, setSearch] = useState<string>('');
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const [keyFilter, setKeyFilter] = useState<KeyFilters>(KeyFilters.null);

  // Handlers
  const handleSearch = useCallback(
    ({ target }: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(target.value);
    },
    [setSearch],
  );

  const handleToggleKey = useCallback(
    (key: KeyFilters) => (): void => {
      setKeyFilter((current) => (current === key ? KeyFilters.null : key));
    },
    [setKeyFilter],
  );

  // Data
  const typeFilterOptions = useMemo(
    () => Array.from(new Set(data.map(({ type }) => type))),
    [data],
  );

  const featuresFiltered = useMemo<Feature[]>(() => {
    let result = data;

    if (keyFilter === KeyFilters.partition) {
      result = filterByAttribute<Feature>(result, true, 'partition');
    }

    if (keyFilter === KeyFilters.primary) {
      result = filterByAttribute<Feature>(result, true, 'primary');
    }

    result = filterByAttribute<Feature>(
      result,
      typeFilters,
      'type',
    ).filter(({ name }) => name.toLowerCase().includes(search.toLowerCase()));

    return result;
  }, [data, search, keyFilter, typeFilters]);

  const [groupComponents, groupProps] = useFeatureListRowData(featuresFiltered);

  return (
    <Card
      mt="30px"
      title="Feature list"
      actions={
        <Button p={0} intent="inline">
          inspect data
        </Button>
      }
    >
      {/* Filters */}
      <Flex>
        <Input
          value={search}
          icon="search"
          placeholder="Find feature"
          onChange={handleSearch}
        />
        <Select
          maxWidth="180px"
          width="max-content"
          ml="15px"
          isMulti
          value={typeFilters}
          options={typeFilterOptions}
          placeholder="type"
          onChange={setTypeFilters}
        />
        <ToggleButton
          ml="15px"
          checked={keyFilter === KeyFilters.primary}
          onChange={handleToggleKey(KeyFilters.primary)}
        >
          primary key only
        </ToggleButton>
        <ToggleButton
          ml="15px"
          checked={keyFilter === KeyFilters.partition}
          onChange={handleToggleKey(KeyFilters.partition)}
        >
          partition key only
        </ToggleButton>
      </Flex>

      {/* Data Rows */}
      <Box mt="30px" mx="-20px" sx={featureListStyles}>
        <Row
          middleColumn={1}
          groupComponents={groupComponents as ComponentType<any>[][]}
          groupProps={groupProps}
        />
      </Box>
    </Card>
  );
};

export default memo(FeatureList);

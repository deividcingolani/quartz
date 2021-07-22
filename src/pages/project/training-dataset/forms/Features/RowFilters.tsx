// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useEffect, useMemo, useState } from 'react';
import { Box, Flex } from 'rebass';
import { useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import {
  Button,
  Callout,
  CalloutTypes,
  Tooltip,
  Value,
} from '@logicalclocks/quartz';

// Types
import { FeatureGroupFilter } from '../../types';
import { FeatureGroup } from '../../../../../types/feature-group';
import { FeatureGroupBasket } from '../../../../../services/localStorage/BasketService';
import { selectFeatureGroupsData } from '../../../../../store/models/feature/selectors';
// Components
import SingleFilter from './SingleFilter';
// Utils
import randomString from '../../../../../utils/randomString';
// Hooks
import useDebounce from '../../../../../hooks/useDebounce';
import icons from '../../../../../sources/icons';

const RowFilters: FC<{
  featureGroups: FeatureGroupBasket[];
  isDisabled: boolean;
}> = ({ featureGroups: basketFgs, isDisabled }) => {
  const { setValue } = useFormContext();

  const [filters, setFilters] = useState<FeatureGroupFilter[]>([]);

  const debouncedFilters = useDebounce(filters, 1000);

  const featureGroups = useSelector(selectFeatureGroupsData).data;

  const mappedFeatureGroups = useMemo(
    () =>
      basketFgs.reduce((acc: FeatureGroup[], { fg }) => {
        const featureGroup = featureGroups.find(({ id }) => id === fg.id);

        return featureGroup ? [...acc, featureGroup] : acc;
      }, []),
    [featureGroups, basketFgs],
  );

  const handleAddFilter = () => {
    const copy = filters.slice();

    copy.push({
      id: randomString(),
      operation: ['≥'],
    });

    setFilters(copy);
  };

  const onDelete = (index: number) => () => {
    const copy = filters.slice();

    copy.splice(index, 1);

    setFilters(copy);
  };

  const changeProperty = (index: number, field: string, value: any) => {
    const copy = filters.slice();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    copy[index][field] = value;

    setFilters(copy);
  };

  useEffect(() => {
    setValue('rowFilters', debouncedFilters);
  }, [debouncedFilters, setValue]);

  return (
    <Box>
      <Flex>
        <Value>Row filters</Value>
        <Tooltip
          ml="8px"
          mb="-4px"
          mainText="Filters let you include only the rows that match your requirements"
        >
          <Box
            sx={{
              svg: {
                width: '15px',
                height: '15px',
              },
            }}
          >
            {icons.info}
          </Box>
        </Tooltip>
      </Flex>
      {!!filters.length && (
        <Box mt="20px">
          <Callout
            type={CalloutTypes.neutral}
            content="Note that filters are combined using AND condition"
          />
        </Box>
      )}
      <Box mt="20px">
        {filters.map((filter, index) => (
          <SingleFilter
            index={index}
            key={filter.id}
            filter={filter}
            onDelete={onDelete}
            isDisabled={isDisabled}
            options={mappedFeatureGroups}
            changeProperty={changeProperty}
          />
        ))}
      </Box>
      <Button
        disabled={isDisabled}
        onClick={handleAddFilter}
        mt={filters.length ? '-12px' : 0}
        intent={filters.length ? 'ghost' : 'primary'}
      >
        {filters.length ? 'Add another filter' : 'Add a filter'}
      </Button>
    </Box>
  );
};

export default RowFilters;

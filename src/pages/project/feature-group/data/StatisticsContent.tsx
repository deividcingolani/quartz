import {
  Input,
  Value,
  Label,
  Select,
  Pagination,
  ToggleButton,
} from '@logicalclocks/quartz';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { Box, Flex } from 'rebass';

import FilterResult from '../../../../components/filter-result/FilterResult';
import {
  Feature,
  FeatureGroup,
  FeatureGroupStatistics,
} from '../../../../types/feature-group';
import paginate, { Paginate } from '../../../../utils/paginate';
import sort, { SortFunc } from '../../../../utils/sort';
import useFeatureFilter, { KeyFilters } from '../hooks/useFeatureFilters';
import StatisticsCard from './StatisticsCard';

export interface StatisticsContentProps {
  featureGroupData: FeatureGroup;
  statistics: { [key: string]: FeatureGroupStatistics };
  view?: string;
}

const pageLimits = {
  '20 features': 20,
  '50 features': 50,
  '100 features': 100,
  '200 features': 200,
  'all features': undefined,
};

const sortKeys: {
  [key: string]: [keyof Feature, SortFunc<any>] | undefined;
} = {
  name: ['name', sort.strting],
  'default order': undefined,
};

type PageLimitsType = typeof pageLimits;

const StatisticsContent: FC<StatisticsContentProps> = ({
  featureGroupData,
  statistics,
  view,
}) => {
  const [[pageLimit], setPageLimit] = useState<[keyof PageLimitsType]>([
    '20 features',
  ]);
  const [[sortKey], setSortKey] = useState<string[]>(['default order']);
  const limit = pageLimits[pageLimit] || 1;
  const [page, setPage] = useState(1);

  const {
    dataFiltered,
    types,

    search,
    typeFilters,
    keyFilter,

    onTypeFiltersChange,
    onSearchChange,
    onToggleKey,
    onReset,
  } = useFeatureFilter(featureGroupData.features, view);

  // Computed data
  const { data: paginatedData, totalPages } = useMemo((): Paginate<Feature> => {
    return paginate<Feature>(dataFiltered, page, pageLimits[pageLimit]);
  }, [dataFiltered, page, pageLimit]);

  const sortedData = useMemo(() => {
    const key = sortKeys[sortKey];

    if (key) {
      const [k, func] = key;

      return sort<Feature>(k, func)(paginatedData);
    }

    return paginatedData;
  }, [paginatedData, sortKey]);

  const featuresLength = featureGroupData.features.length;
  const displayFeaturesLength = dataFiltered.length;
  const isFiltered = featuresLength !== displayFeaturesLength;

  // Effects
  useEffect(() => {
    setPage(1);
  }, [limit]);

  return (
    <>
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
          />
          <ToggleButton
            ml="15px"
            variant="white"
            checked={keyFilter === KeyFilters.primary}
            onChange={onToggleKey(KeyFilters.primary)}
          >
            primary key only
          </ToggleButton>
          <ToggleButton
            ml="15px"
            variant="white"
            checked={keyFilter === KeyFilters.partition}
            onChange={onToggleKey(KeyFilters.partition)}
          >
            partition key only
          </ToggleButton>

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
        <Flex width="100%" mt="30px" alignItems="center">
          <Value primary px="5px">
            {displayFeaturesLength}
          </Value>
          <Value>features displayed out of</Value>
          <Value primary px="5px">
            {featuresLength}
          </Value>
          <Value>features x</Value>
          <Value primary px="5px">
            N
          </Value>
          <Value>rows</Value>

          <Select
            width="max-content"
            variant="white"
            value={[pageLimit]}
            ml="auto"
            label="show"
            align="left"
            options={Object.keys(pageLimits)}
            placeholder=""
            /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
            // @ts-ignore
            onChange={setPageLimit}
          />
          <Label ml="10px" as="span" text="go to page" align="left">
            <Pagination
              variant="white"
              disabled={totalPages === 1}
              totalPages={totalPages}
              currentPage={page}
              onChange={setPage}
            />
          </Label>
        </Flex>
        <Box height="100%" width="100%">
          {sortedData.map((data, index) => (
            <Box mt={index ? '20px' : '40px'} key={data.name}>
              <StatisticsCard data={data} statistics={statistics[data.name]} />
            </Box>
          ))}
        </Box>
        {sortedData.length > 1 && (
          <Label mt="65px" as="span" text="go to page" align="left">
            <Pagination
              variant="white"
              disabled={totalPages === 1}
              totalPages={totalPages}
              currentPage={page}
              onChange={setPage}
            />
          </Label>
        )}
      </Flex>
      {isFiltered && (
        <FilterResult
          subject="features"
          result={dataFiltered.length}
          onReset={onReset}
        />
      )}
    </>
  );
};

export default StatisticsContent;

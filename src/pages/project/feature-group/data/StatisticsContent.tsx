import {
  Input,
  Value,
  Label,
  Select,
  Pagination,
  ToggleButton,
  Symbol,
  SymbolMode,
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
import { TrainingDataset } from '../../../../types/training-dataset';
import { ItemDrawerTypes } from '../../../../components/drawer/ItemDrawer';
import useBasket from '../../../../hooks/useBasket';
import icons from '../../../../sources/icons';

export interface StatisticsContentProps {
  data: FeatureGroup | TrainingDataset;
  statistics: { [key: string]: FeatureGroupStatistics };
  view?: string;
  type?: ItemDrawerTypes;
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
  name: ['name', sort.string],
  'default order': undefined,
};

type PageLimitsType = typeof pageLimits;

const StatisticsContent: FC<StatisticsContentProps> = ({
  data,
  statistics,
  view,
  type = ItemDrawerTypes.fg,
}) => {
  const [[pageLimit], setPageLimit] = useState<[keyof PageLimitsType]>([
    '20 features',
  ]);
  const [[sortKey], setSortKey] = useState<string[]>(['default order']);
  const limit = pageLimits[pageLimit] || 1;
  const [page, setPage] = useState(1);

  const { isActiveFeatures, handleBasket, isSwitch } = useBasket();

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
  } = useFeatureFilter(data.features, view);

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

  const featuresLength = data.features.length;
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
          <Box
            sx={{
              label: {
                div: {
                  backgroundColor: '#ffffff',
                },
                'div:hover': {
                  div: {
                    backgroundColor: 'grayShade3',
                    borderColor: 'transparent',
                  },
                },
              },
            }}
          >
            <ToggleButton
              ml="15px"
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
                    backgroundColor: 'grayShade3',
                    borderColor: 'transparent',
                  },
                },
              },
            }}
          >
            <ToggleButton
              ml="15px"
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
          <Select
            width="max-content"
            variant="white"
            listWidth="100%"
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
          <Value>features</Value>
          {isSwitch && type === ItemDrawerTypes.fg && (
            <Box ml="10px">
              <Symbol
                mode={SymbolMode.bulk}
                possible={sortedData.length > 0}
                tooltipMainText="Add all features to basket"
                tooltipSecondaryText={`${sortedData.length} features`}
                handleClick={handleBasket(sortedData, data as FeatureGroup)}
                inBasket={isActiveFeatures(sortedData, data as FeatureGroup)}
              />
            </Box>
          )}

          <Box
            ml="auto"
            sx={{
              span: {
                marginTop: '4px',
              },
            }}
          >
            <Select
              width="max-content"
              variant="white"
              value={[pageLimit]}
              label="show"
              align="left"
              options={Object.keys(pageLimits)}
              placeholder=""
              /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
              // @ts-ignore
              onChange={setPageLimit}
            />
          </Box>
          <Box
            sx={{
              span: {
                marginTop: '4px',
              },
            }}
          >
            <Label ml="10px" as="span" text="go to page" align="left">
              <Pagination
                variant="white"
                disabled={totalPages === 1}
                totalPages={totalPages}
                currentPage={page}
                onChange={setPage}
              />
            </Label>
          </Box>
        </Flex>
        <Box height="100%" width="100%">
          {sortedData.map((feature, index) => (
            <Box mt={index ? '20px' : '40px'} key={feature.name}>
              <StatisticsCard
                type={type}
                parent={data}
                data={feature}
                statistics={statistics[feature.name]}
              />
            </Box>
          ))}
        </Box>
        {sortedData.length > 1 && (
          <Label mt="65px" mb="40px" as="span" text="go to page" align="left">
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

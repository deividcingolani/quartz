// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, useCallback, useMemo } from 'react';
import { Box, Flex } from 'rebass';
import { List } from 'react-virtualized';
import { ListRowProps } from 'react-virtualized/dist/es/List';

import {
  Card,
  IconButton,
  IconName,
  Label,
  TooltipPositions,
} from '@logicalclocks/quartz';
// Components
import Cell from '../components/Cell';
import NoFeaturesSelected from '../NoFeaturesSelected';
import ListFeatureMinMaxCorrelation from './ListFeatureMinMaxCorrelation';
// Types
import { CorrelationSortType, CorrelationValue } from '../types';
import {
  CorrelationItem,
  FeatureGroupStatistics,
} from '../../../types/feature-group';
// Utils
import { compareCorrelationValues, sortCorrelationsList } from '../utils';

export interface CorrelationListProps {
  selectedFeatures: string[];
  sortType: CorrelationSortType;
  pickedCorrelations: CorrelationValue[];
  onPickCorrelation: (value: CorrelationValue) => void;
  correlation: { [key: string]: FeatureGroupStatistics };
  defaultCorrelations: { [key: string]: FeatureGroupStatistics };
}

const CorrelationList: FC<CorrelationListProps> = ({
  sortType,
  correlation,
  selectedFeatures,
  onPickCorrelation,
  pickedCorrelations,
  defaultCorrelations,
}) => {
  const mapped = useMemo(() => {
    const a = Object.entries(correlation) // TODO del const a
      .reduce(
        (acc: (CorrelationItem & { key: string })[], next, _index) => [
          // TODO del const b
          ...acc,
          ...next[1].correlations.map((data) => ({ ...data, key: next[0] })),
        ],
        [],
      )
      .filter(
        (correlation, _index, _array) =>
          correlation.key !== correlation.column &&
          selectedFeatures.includes(correlation.key) &&
          selectedFeatures.includes(correlation.column),
      );

    const names: Set<string> = new Set();
    const indexOfInsertedValues: Set<number> = new Set();

    const res = a.reduce(
      (acc: (CorrelationItem & { key: string })[], value, index) => {
        if (indexOfInsertedValues.has(index)) return acc;

        names.add(value.column);
        names.add(value.key);

        a.some((inner, innerIndex) => {
          if (
            value !== inner &&
            names.has(inner.column) &&
            names.has(inner.key)
          ) {
            indexOfInsertedValues.add(innerIndex);
            return true;
          }

          return false;
        });

        acc.push(value);
        names.clear();

        return acc;
      },
      [],
    );

    return sortCorrelationsList(sortType, res);
  }, [correlation, sortType, selectedFeatures]);

  const rowRendered = useCallback(
    ({ index, key, isVisible, style }: ListRowProps) => {
      if (!isVisible) {
        return <div style={style} key={key} />;
      }

      const {
        column,
        correlation: correlationValue,
        key: columnKey,
      } = mapped[index];

      const correlationToPick = {
        vertical: columnKey,
        horizontal: column,
        value: correlationValue,
      };

      const isPicked = !!pickedCorrelations.find((prevValue) =>
        compareCorrelationValues(prevValue, correlationToPick),
      );

      return (
        <Flex
          px="15px"
          py="10px"
          justifyContent="space-between"
          key={key}
          style={style}
          sx={{ boxShadow: '0px -1px 0px rgba(0, 0, 0, 0.25)' }}
        >
          <Flex width="40%">
            <Box mr="20px">
              <IconButton
                icon={isPicked ? IconName.cross : IconName.plus}
                onClick={() => {
                  onPickCorrelation(correlationToPick);
                }}
                tooltip={
                  isPicked
                    ? 'Remove to hand picked correlations'
                    : 'Add to hand picked correlations'
                }
                tooltipProps={{ position: TooltipPositions.right }}
              />
            </Box>
            <Flex
              justifyContent="space-between"
              flexDirection="column"
              height="30px"
            >
              <Label
                color={
                  !selectedFeatures.includes(columnKey) ? 'gray' : 'initial'
                }
              >
                {columnKey}
              </Label>
              <ListFeatureMinMaxCorrelation
                name={columnKey}
                data={defaultCorrelations[columnKey].correlations}
              />
            </Flex>
          </Flex>

          <Flex width="70px" alignItems="center" justifyContent="space-between">
            <Cell value={correlationValue} />
            <Label>{correlationValue.toFixed(2)}</Label>
          </Flex>

          <Flex
            width="40%"
            height="30px"
            alignItems="flex-end"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Label
              color={!selectedFeatures.includes(column) ? 'gray' : 'initial'}
            >
              {column}
            </Label>
            <Box>
              <ListFeatureMinMaxCorrelation
                name={columnKey}
                data={defaultCorrelations[columnKey].correlations}
              />
            </Box>
          </Flex>
        </Flex>
      );
    },
    [
      mapped,
      selectedFeatures,
      onPickCorrelation,
      pickedCorrelations,
      defaultCorrelations,
    ],
  );

  if (
    !selectedFeatures.length ||
    !Object.entries(correlation)
      .reduce(
        (acc: (CorrelationItem & { key: string })[], next, index) => [
          ...acc,
          ...next[1].correlations
            .slice(index + 1)
            .map((data) => ({ ...data, key: next[0] })),
        ],
        [],
      )
      .filter(
        ({ key, column }) =>
          selectedFeatures.includes(key) || selectedFeatures.includes(column),
      ).length
  ) {
    return <NoFeaturesSelected />;
  }

  return (
    <Card contentProps={{ p: 0 }}>
      <List
        style={{
          outline: 'none',
          width: '100%',
        }}
        containerStyle={{
          width: '100%',
          maxWidth: '100%',
        }}
        width={1000}
        height={mapped.length * 52 > 571 ? 571 : mapped.length * 52}
        rowHeight={52}
        autoWidth={true}
        rowCount={mapped.length}
        rowRenderer={rowRendered}
      />
    </Card>
  );
};

export default memo(CorrelationList);

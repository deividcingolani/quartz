import { Box, Flex } from 'rebass';
import React, { FC, memo, useMemo, useState } from 'react';
import {
  Button,
  Callout,
  CalloutTypes,
  Card,
  CheckboxGroup,
  Input,
  Label,
  MultiRangeSlider,
  RadioGroup,
  Select,
  TooltipPositions,
} from '@logicalclocks/quartz';

// Types
import { CorrelationSortType, CorrelationType } from './types';
import { FeatureGroupStatistics } from '../../types/feature-group';

export interface CorrelationSelectorProps {
  plusRange: number[];
  minusRange: number[];
  maxCount: number;
  selected: string[];
  type: CorrelationType;
  sortType: CorrelationSortType;
  onSelect: (value: string[]) => void;
  onMinusRangeChange: (range: number[]) => void;
  onPlusRangeChange: (range: number[]) => void;
  handleTypeChange: (type: CorrelationType) => void;
  correlation: { [key: string]: FeatureGroupStatistics };
  handleSortTypeChange: (type: CorrelationSortType) => void;
}

const CorrelationSelector: FC<CorrelationSelectorProps> = ({
  type,
  maxCount,
  sortType,
  selected,
  onSelect,
  plusRange,
  minusRange,
  correlation,
  handleTypeChange,
  onPlusRangeChange,
  onMinusRangeChange,
  handleSortTypeChange,
}) => {
  const features = Object.keys(correlation);

  const [search, setSearch] = useState('');

  const filteredFeatures = useMemo(() => {
    if (!search.trim()) {
      return features;
    }

    return features.filter((value) =>
      value.toLowerCase().includes(search.toLowerCase().trim()),
    );
  }, [search, features]);

  return (
    <Card
      contentProps={{
        p: '15px',
      }}
      mr="20px"
      width="240px"
      minWidth="240px"
      height="calc(100vh - 160px)"
    >
      <Flex maxHeight="calc(100vh - 192px)" flexDirection="column">
        <Label>Representation</Label>
        <RadioGroup
          value={type}
          options={Object.values(CorrelationType)}
          onChange={(value) => handleTypeChange(value as CorrelationType)}
        />

        {type === CorrelationType.list && (
          <>
            <Label mb="8px" mt="25px">
              Sort correlations
            </Label>
            <Select
              width="210px"
              placeholder=""
              listWidth="210px"
              value={[sortType]}
              onChange={(value) =>
                handleSortTypeChange(value[0] as CorrelationSortType)
              }
              options={Object.values(CorrelationSortType)}
            />
          </>
        )}

        {type === CorrelationType.matrix &&
          (selected.length === maxCount ? (
            <Box mt="25px">
              <Callout
                type={CalloutTypes.neutral}
                content={`${maxCount} correlations displayed`}
              />
            </Box>
          ) : selected.length < maxCount ? (
            <Flex
              mt="25px"
              height="34px"
              bg="grayShade3"
              minHeight="34px"
              alignItems="center"
              justifyContent="center"
            >
              <Label>{selected.length} features selected</Label>
            </Flex>
          ) : (
            <Box mt="25px">
              <Callout
                type={CalloutTypes.warning}
                content={`${maxCount} features selected max`}
              />
            </Box>
          ))}

        {type === CorrelationType.list && (
          <Flex
            mt="25px"
            height="34px"
            bg="grayShade3"
            minHeight="34px"
            alignItems="center"
            justifyContent="center"
          >
            <Label>{selected.length} features selected</Label>
          </Flex>
        )}

        {type === CorrelationType.list && (
          <>
            <Label mt="25px">Filter by correlation</Label>
            <Flex mt="30px">
              <Label>-1</Label>
              <Box mt="1px" width="100%" mr="7px" ml="9px">
                <MultiRangeSlider
                  max={0}
                  min={-1}
                  value={minusRange}
                  handleChange={onMinusRangeChange}
                />
              </Box>
              <Label>0</Label>
            </Flex>
            <Flex mt="30px">
              <Label>0</Label>
              <Box mt="1px" width="100%" mr="7px" ml="9px">
                <MultiRangeSlider
                  max={1}
                  min={0}
                  value={plusRange}
                  handleChange={onPlusRangeChange}
                />
              </Box>
              <Label>1</Label>
            </Flex>
          </>
        )}

        <Input
          label=" Features displayed"
          width="210px"
          value={search}
          labelProps={{ mt: '30px' }}
          placeholder="Find a feature..."
          onChange={({ target }: any) => setSearch(target.value)}
        />
        <Flex>
          <Button
            pr="4px"
            ml="-15px"
            intent="inline"
            onClick={() => onSelect([])}
          >
            select none
          </Button>
          <Button
            pl="4px"
            intent="inline"
            onClick={() => onSelect(features)}
            disabled={
              selected.length >= maxCount && type === CorrelationType.matrix
            }
          >
            select all
          </Button>
        </Flex>
        <Box
          sx={{
            borderColor: 'grayShade2',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderLeft: 'none',
            borderRight: 'none',
          }}
          pb="20px"
          mb="-7px"
          overflow="auto"
          maxHeight="calc(100% - 242px)"
        >
          <Box
            sx={{
              span: {
                position: 'relative',
              },
            }}
          >
            <CheckboxGroup
              label=""
              value={selected}
              onChange={onSelect}
              options={filteredFeatures}
              tooltipProps={{
                position: TooltipPositions.right,
                mainText: 'The graph is full, unselect other features',
              }}
              disabledUnselect={
                selected.length >= maxCount && type === CorrelationType.matrix
              }
            />
          </Box>
        </Box>
      </Flex>
    </Card>
  );
};

export default memo(CorrelationSelector);

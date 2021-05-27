import { Box, Flex } from 'rebass';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

// Components
import CorrelationList from './list/CorrelationList';
import CorrelationTable, { margin } from './matrix/CorrelationTable';
import PickedCorrelations from './PickedCorrelations';
import CorrelationSelector from './CorrelationSelector';
// Types
import { FeatureGroupStatistics } from '../../types/feature-group';
import {
  CorrelationType,
  CorrelationValue,
  CorrelationSortType,
} from './types';
// Utils
import {
  compareCorrelationValues,
  filterCorrelations,
  filterCorrelationsByRange,
} from './utils';
import { DataEntity } from '../../types';
import { ItemDrawerTypes } from '../drawer/ItemDrawer';
import useDebounce from '../../hooks/useDebounce';

export interface CorrelationProps {
  correlation: { [key: string]: FeatureGroupStatistics };
  item: DataEntity;
  type: ItemDrawerTypes;
}

const maxContainerWidth = 1000;

const Correlation: FC<CorrelationProps> = ({
  correlation: defaultCorrelations,
  item,
  type: dataType,
}) => {
  const [type, setType] = useState<CorrelationType>(CorrelationType.matrix);
  const [sortType, setSortType] = useState<CorrelationSortType>(
    CorrelationSortType.lowestAndHighest,
  );

  const [minusRange, setMinusRange] = useState<number[]>([-1, 0]);
  const [plusRange, setPlusRange] = useState<number[]>([0, 1]);

  const debouncedRange = useDebounce(
    JSON.stringify([...minusRange, ...plusRange]),
    500,
  );

  const correlation = useMemo(() => {
    let a = filterCorrelationsByRange(
      JSON.parse(debouncedRange),
      defaultCorrelations,
    );
    return a;
  }, [defaultCorrelations, debouncedRange]);


  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    Object.keys(correlation),
  );
  
  const [pickedCorrelations, setPickedCorrelations] = useState<
    CorrelationValue[]
  >([]);

  const [maxFeatures, setMaxFeatures] = useState(
    Math.floor((maxContainerWidth - margin.left) / 26),
  );

  const onTypeChange = useCallback((value) => {
    setType(value);
  }, []);
  const onSortTypeChange = useCallback((value) => {
    setSortType(value);
  }, []);

  const onPickCorrelation = useCallback(
    (value: CorrelationValue) => {
      const copy = pickedCorrelations.slice();
      const valueIndex = copy.findIndex((prevValue) =>
        compareCorrelationValues(prevValue, value),
      );
      if (valueIndex > -1) {
        copy.splice(valueIndex, 1);
      } else {
        copy.unshift(value);
      }
      setPickedCorrelations(copy);
    },
    [pickedCorrelations],
  );

  useEffect(() => {
    const selectedByRangeFeatures = Object.keys(correlation);
    const filteredWithRangeFeatures = selectedFeatures
      .slice()
      .filter((feature) => selectedByRangeFeatures.includes(feature));

    setSelectedFeatures(filteredWithRangeFeatures);
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [correlation]);

  const matrixSelected = useMemo(() => {
    return filterCorrelations(selectedFeatures, defaultCorrelations);
  }, [selectedFeatures, defaultCorrelations]);
  return (
    <Flex mt="50px">
      <CorrelationSelector
        type={type}
        minusRange={minusRange}
        plusRange={plusRange}
        sortType={sortType}
        maxCount={maxFeatures}
        selected={selectedFeatures}
        onSelect={setSelectedFeatures}
        handleTypeChange={onTypeChange}
        correlation={defaultCorrelations}
        handleSortTypeChange={onSortTypeChange}
        onMinusRangeChange={(value: number[]) => setMinusRange(value)}
        onPlusRangeChange={(value: number[]) => setPlusRange(value)}
      />

      <Box width="100%">
        {type === CorrelationType.matrix ? (
          <CorrelationTable
            maxCount={maxFeatures}
            correlation={matrixSelected}
            changeMaxCount={setMaxFeatures}
            onPickCorrelation={onPickCorrelation}
            pickedCorrelations={pickedCorrelations}
          />
        ) : (
          <CorrelationList
            sortType={sortType}
            correlation={correlation}
            selectedFeatures={selectedFeatures}
            onPickCorrelation={onPickCorrelation}
            pickedCorrelations={pickedCorrelations}
            defaultCorrelations={defaultCorrelations}
          />
        )}
        <PickedCorrelations
          type={dataType}
          item={item}
          pickedCorrelations={pickedCorrelations}
          onClearPicked={() => setPickedCorrelations([])}
        />
      </Box>
    </Flex>
  );
};

export default Correlation;

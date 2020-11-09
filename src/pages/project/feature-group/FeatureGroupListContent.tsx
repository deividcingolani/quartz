import React, { FC } from 'react';

// Types
import { FeatureGroup } from '../../../types/feature-group';
// Components
import Card from './components/Card';
import FilterResult from '../../../components/filter-result/FilterResult';

export interface FeatureGroupListContentProps {
  data: FeatureGroup[];
  isLabelsLoading: boolean;
  isFiltered: boolean;
  onResetFilters: () => void;
}

const FeatureGroupListContent: FC<FeatureGroupListContentProps> = ({
  data,
  onResetFilters,
  isFiltered,
  isLabelsLoading,
}) => {
  return (
    <>
      {data.map((item) => (
        <Card key={item.id} data={item} isLabelsLoading={isLabelsLoading} />
      ))}
      {isFiltered && (
        <FilterResult
          subject="feature groups"
          result={data.length}
          onReset={onResetFilters}
        />
      )}
    </>
  );
};

export default FeatureGroupListContent;

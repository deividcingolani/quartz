import React, { FC } from 'react';

// Types
import { ITrainingDataset } from '../../../../types/training-dataset';
// Components
import FilterResult from '../../../../components/filter-result/FilterResult';
import Card from './Card';

export interface TrainingDatasetListContentProps {
  data: ITrainingDataset[];
  isLabelsLoading: boolean;
  isFiltered: boolean;
  onResetFilters: () => void;
}

const TrainingDatasetListContent: FC<TrainingDatasetListContentProps> = ({
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
          subject="training datasets"
          result={data.length}
          onReset={onResetFilters}
        />
      )}
    </>
  );
};

export default TrainingDatasetListContent;

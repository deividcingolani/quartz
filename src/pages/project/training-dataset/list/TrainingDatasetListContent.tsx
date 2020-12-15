import React, { FC } from 'react';

// Types
import { TrainingDataset } from '../../../../types/training-dataset';
// Components
import FilterResult from '../../../../components/filter-result/FilterResult';
import Card from './Card';
import useDrawer from '../../../../hooks/useDrawer';
import ItemDrawer, {
  ItemDrawerTypes,
} from '../../../../components/drawer/ItemDrawer';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';

export interface TrainingDatasetListContentProps {
  data: TrainingDataset[];
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
  const { isOpen, selectedId, handleSelectItem, handleClose } = useDrawer();

  const allTrainingDatasets = useSelector(
    (state: RootState) => state.trainingDatasets,
  );

  return (
    <>
      {!!selectedId && (
        <ItemDrawer<TrainingDataset>
          data={allTrainingDatasets}
          id={selectedId}
          isOpen={isOpen}
          handleToggle={handleClose}
          navigateTo={(id: number) => `/td/${id}`}
          type={ItemDrawerTypes.td}
        />
      )}
      {data.map((item) => (
        <Card
          key={item.id}
          handleToggle={handleSelectItem(item.id)}
          isSelected={selectedId === item.id}
          data={item}
          isLabelsLoading={isLabelsLoading}
        />
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

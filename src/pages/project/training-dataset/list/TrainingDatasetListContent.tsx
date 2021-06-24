// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useEffect, useMemo } from 'react';

// Types
import { useDispatch, useSelector } from 'react-redux';
import { TrainingDataset } from '../../../../types/training-dataset';
// Components
import FilterResult from '../../../../components/filter-result/FilterResult';
import Card from './Card';
import useDrawer from '../../../../hooks/useDrawer';
import ItemDrawer, {
  ItemDrawerTypes,
} from '../../../../components/drawer/ItemDrawer';
import { Dispatch, RootState } from '../../../../store';

export interface TrainingDatasetListContentProps {
  data: TrainingDataset[];
  isFiltered: boolean;
  onResetFilters: () => void;
  hasMatchText?: boolean;
  loading?: boolean;
}

const TrainingDatasetListContent: FC<TrainingDatasetListContentProps> = ({
  data,
  onResetFilters,
  isFiltered,
  hasMatchText,
  loading,
}) => {
  const { isOpen, selectedId, handleSelectItem, handleClose } = useDrawer();

  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    const td = data.find(({ id }) => id === selectedId);
    if (td && selectedId && hasMatchText) {
      dispatch.trainingDatasets.fetch({
        projectId: td.parentProjectId,
        featureStoreId: td.featurestoreId,
      });
    }

    /* eslint-disable react-hooks/exhaustive-deps */
  }, [selectedId, hasMatchText, dispatch]);

  const projectId = useMemo(() => {
    const fg = data.find(({ id }) => id === selectedId);
    if (fg) {
      return fg.parentProjectId;
    }
    return undefined;
  }, [selectedId, data]);

  const allTrainingDatasets = useSelector(
    (state: RootState) => state.trainingDatasets,
  );

  return (
    <>
      {!!selectedId && (
        <ItemDrawer<TrainingDataset>
          data={allTrainingDatasets}
          isSearch={hasMatchText}
          projectId={projectId}
          id={selectedId}
          isOpen={isOpen}
          handleToggle={handleClose}
          navigateTo={(id: number) => `/td/${id}`}
          type={ItemDrawerTypes.td}
        />
      )}
      {data.map((item) => (
        <Card
          hasMatchText={hasMatchText}
          key={item.id}
          loading={loading}
          handleToggle={handleSelectItem(item.id)}
          isSelected={selectedId === item.id}
          data={item}
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

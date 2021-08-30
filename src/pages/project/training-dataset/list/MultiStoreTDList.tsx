// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useParams } from 'react-router';
import Loader from '../../../../components/loader/Loader';
import useSharedFrom from '../../settings/useSharedFrom';
import TrainingDatasetList from './TrainingDatasetList';
// Layouts
import Error404 from '../../../error/404Error';
// Hooks
import useMultiStoreSelect from '../../../../hooks/useMultiStoreSelect';
import useTrainingDatasets, {
  UseTrainingDatasetsData,
} from '../useTrainingDatasets';

const MultiStoreTDList: FC = () => {
  const { id: pId } = useParams();

  const { data: sharedFrom, isLoading: isSharedLoading } = useSharedFrom(+pId);

  const {
    selectFSValue,
    selectFSOptions,
    handleFSSelectionChange,
    data,
    invalidFS,
    isLoading,
    hasSharedFS,
  } = useMultiStoreSelect<UseTrainingDatasetsData>(
    useTrainingDatasets,
    sharedFrom || [],
  );

  if (!sharedFrom || isSharedLoading) {
    return <Loader />;
  }

  if (invalidFS) {
    return <Error404 />;
  }

  return (
    <TrainingDatasetList
      data={data}
      selectFSValue={selectFSValue}
      selectFSOptions={selectFSOptions}
      isLoading={isLoading}
      hasSharedFS={hasSharedFS}
      handleFSSelectionChange={handleFSSelectionChange}
    />
  );
};

export default MultiStoreTDList;

// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useEffect, useMemo } from 'react';
import { Select } from '@logicalclocks/quartz';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
// Utils
import { Controller } from 'react-hook-form';
import { Dispatch, RootState } from '../../../../store';
import getInputValidation from '../../../../utils/getInputValidation';
import { selectFeatureStoreData } from '../../../../store/models/feature/selectors';
// Default validators
import { shortText } from '../../../../utils/validators';
// Types
import { StorageConnectorFormProps } from './types';
import { Dataset } from '../../../../types/dataset';

export const schema = yup.object().shape({
  datasetName: shortText.required().label('Dataset'),
});

const HopsForm: FC<StorageConnectorFormProps> = ({
  control,
  isDisabled,
  errors,
}) => {
  const { data: featureStoreData } = useSelector(selectFeatureStoreData);

  const datasets = useSelector((state: RootState) => state.dataset);
  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    if (featureStoreData?.projectId && featureStoreData?.featurestoreId) {
      dispatch.dataset.fetch({
        projectId: featureStoreData.projectId,
      });
    }
    return () => {
      dispatch.dataset.clear();
    };
  }, [dispatch.dataset, featureStoreData]);

  const datasetNames = useMemo(() => {
    return datasets.map((ds: Dataset) => ds.name);
  }, [datasets]);

  return (
    <>
      <Controller
        control={control}
        name="datasetName"
        defaultValue=""
        render={({ onChange, value }) => (
          <Select
            disabled={isDisabled || !(datasets?.length > 0)}
            width="fit-end"
            noDataMessage="no dataset defined"
            placeholder="select a dataset"
            label="Dataset"
            listWidth="100%"
            hasPlaceholder={false}
            options={datasetNames}
            value={value ? [value] : []}
            onChange={(val) => onChange(val)}
            {...getInputValidation('datasetName', errors)}
          />
        )}
      />
    </>
  );
};

export default HopsForm;

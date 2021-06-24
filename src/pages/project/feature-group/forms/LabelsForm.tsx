// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { Box, Flex } from 'rebass';
import { Controller, useForm, useFormContext } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Input,
  Label,
  TinyPopup,
  usePopup,
  Labeling,
  EditableSelect,
} from '@logicalclocks/quartz';
import { useSelector } from 'react-redux';
// Types
import { FeatureFormProps } from '../types';
// Selectors
import { RootState } from '../../../../store';
// Components
import getInputValidation from '../../../../utils/getInputValidation';
// Schemas
import { keywordSchema } from '../../../../components/keywords-editor/KeywordsEditor';
import { FeatureGroupViewState } from '../../../../store/models/feature/featureGroupView.model';
import { ItemDrawerTypes } from '../../../../components/drawer/ItemDrawer';

const LabelsForm: FC<FeatureFormProps> = ({
  isDisabled,
  type = ItemDrawerTypes.fg,
}) => {
  const { control, setValue, getValues } = useFormContext();

  const [isPopupOpen, handleToggle] = usePopup(false);

  const { errors, register, handleSubmit, setError } = useForm({
    shouldUnregister: false,
    resolver: yupResolver(keywordSchema),
  });

  const baseOptions = useSelector(
    (state: RootState) => state.featureGroupLabels,
  );

  const [options, setOptions] = useState<string[]>(baseOptions);

  const isLoadingKeywordsFG = useSelector(
    (state: RootState) =>
      state.loading.effects.featureGroupView.loadRemainingData,
  );

  const isLoadingKeywordsTD = useSelector(
    (state: RootState) =>
      state.loading.effects.trainingDatasetView.loadRemainingData,
  );

  const featureGroup = useSelector<RootState, FeatureGroupViewState>(
    (state) => state.featureGroupView,
  );

  const trainingDataset = useSelector(
    (state: RootState) => state.trainingDatasetView,
  );

  useEffect(() => {
    if (featureGroup?.labels && type === ItemDrawerTypes.fg) {
      setValue('keywords', featureGroup.labels);
    }
    if (trainingDataset?.labels && type === ItemDrawerTypes.td) {
      setValue('keywords', trainingDataset.labels);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingKeywordsFG, isLoadingKeywordsTD]);

  useEffect(() => {
    setOptions(baseOptions);
  }, [baseOptions]);

  const handleAdd = useCallback(
    async (keyword: string) => {
      setOptions((prev) => [keyword, ...prev]);
      setValue('keywords', [keyword, ...getValues('keywords')]);
      handleToggle();
    },
    [handleToggle, setValue, getValues],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSubmit = useCallback(
    handleSubmit(({ keyword }) => {
      const lowerCaseKeyword = keyword.toLowerCase();

      if (baseOptions.includes(lowerCaseKeyword)) {
        setError('keyword', { message: 'Keyword should be unique' });
        return;
      }

      handleAdd(lowerCaseKeyword);
    }),
    [handleAdd, baseOptions],
  );

  if (isLoadingKeywordsFG || isLoadingKeywordsTD) {
    return (
      <Box mt="20px">
        <Label mb="4px">Keywords</Label>
        <Labeling gray>loading...</Labeling>
      </Box>
    );
  }

  return (
    <>
      <Box mt="20px">
        <Label mb="4px">Keywords</Label>
        <Controller
          control={control}
          name="keywords"
          render={({ onChange, value }) => {
            return (
              <Box mt="5px">
                <>
                  <Flex>
                    <EditableSelect
                      isMulti
                      flex={1}
                      value={value}
                      options={options}
                      onChange={onChange}
                      disabled={isDisabled}
                      placeholder="keywords"
                      noDataMessage="No keywords defined"
                    />
                  </Flex>
                </>
              </Box>
            );
          }}
        />
      </Box>

      <TinyPopup
        title="Add another keyword"
        secondaryText=""
        isOpen={isPopupOpen}
        mainButton={['Create new keyword', onSubmit]}
        secondaryButton={['Cancel', handleToggle]}
        onClose={handleToggle}
      >
        <Input
          mb="20px"
          ref={register}
          labelProps={{ width: '100%' }}
          label="Value"
          name="keyword"
          placeholder="New keyword value"
          {...getInputValidation('keyword', errors)}
        />
      </TinyPopup>
    </>
  );
};

export default memo(LabelsForm);

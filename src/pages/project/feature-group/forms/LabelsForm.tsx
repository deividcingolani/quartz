import React, { FC, memo } from 'react';
import { Box } from 'rebass';
import { Controller, useFormContext } from 'react-hook-form';
import { Label } from '@logicalclocks/quartz';
// Types
import { FeatureFormProps } from '../types';
// Selectors
import Divider from '../../../../components/divider/Devider';
// Components
import KeywordsEditor from '../../../../components/keywords-editor/KeywordsEditor';

const LabelsForm: FC<FeatureFormProps> = ({ isDisabled }) => {
  const { control } = useFormContext();

  return (
    <Box mt="20px">
      <Label mb="4px">Keywords</Label>
      <Controller
        control={control}
        name="keywords"
        render={({ onChange, value }) => (
          <Box mt="5px">
            <KeywordsEditor
              selectVariant="primary"
              isDisabled={isDisabled}
              value={value}
              onSave={onChange}
            />
          </Box>
        )}
      />
      <Divider mt="20px" ml="-20px" />
    </Box>
  );
};

export default memo(LabelsForm);

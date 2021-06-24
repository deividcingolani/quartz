// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import { Button, StickySummary } from '@logicalclocks/quartz';
import { ItemDrawerTypes } from '../../../../components/drawer/ItemDrawer';
import useScreenWithScroll from '../../../../hooks/useScreenWithScroll';

export interface StickySummaryProps {
  onSubmit: () => void;
  isEdit?: boolean;
  isUpdatedFeatures?: boolean;
  disabled: boolean;
  errorsValue: string;
  type?: ItemDrawerTypes;
}

const FeatureStickySummary: FC<StickySummaryProps> = ({
  onSubmit,
  isUpdatedFeatures,
  isEdit,
  disabled,
  errorsValue,
  type = ItemDrawerTypes.fg,
}) => {
  const { watch } = useFormContext();

  const navigate = useNavigate();
  const { name } = watch(['name']);
  const hasScrollOnScreen = useScreenWithScroll();

  return (
    <StickySummary
      mainButton={
        <Button
          disabled={disabled}
          intent="primary"
          type="submit"
          onClick={onSubmit}
        >
          {type === ItemDrawerTypes.td &&
            !isEdit &&
            'Create New Training Dataset'}
          {type === ItemDrawerTypes.td && isEdit && 'Save'}

          {type === ItemDrawerTypes.fg && !isEdit && 'Create New Feature Group'}
          {type === ItemDrawerTypes.fg &&
            isEdit &&
            isUpdatedFeatures &&
            'Save and create a new version'}
          {type === ItemDrawerTypes.fg &&
            isEdit &&
            !isUpdatedFeatures &&
            'Save feature group'}
        </Button>
      }
      secondaryButton={
        <Button
          type="button"
          intent="secondary"
          disabled={disabled}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      }
      title={name}
      errorsValue={errorsValue}
      hasScrollOnScreen={hasScrollOnScreen}
    />
  );
};

export default memo(FeatureStickySummary);

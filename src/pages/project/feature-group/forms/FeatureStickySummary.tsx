import React, { FC, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, StickySummary } from '@logicalclocks/quartz';

export interface StickySummaryProps {
  onSubmit: () => void;
  watch: any;
  isEdit?: boolean;
  isUpdatedFeatures?: boolean;
  disabled: boolean;
}

const FeatureStickySummary: FC<StickySummaryProps> = ({
  onSubmit,
  watch,
  isUpdatedFeatures,
  isEdit,
  disabled,
}) => {
  const navigate = useNavigate();

  const { name } = watch(['name']);

  return (
    <StickySummary
      mainButton={
        <Button
          disabled={disabled}
          intent="primary"
          type="submit"
          onClick={onSubmit}
        >
          {!isEdit
            ? 'Create New Feature Group'
            : isUpdatedFeatures
            ? 'Save and create a new version'
            : 'Save feature group'}
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
    />
  );
};

export default memo(FeatureStickySummary);

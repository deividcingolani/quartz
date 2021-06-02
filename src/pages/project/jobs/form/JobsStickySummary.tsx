import React, { FC, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import { Button, StickySummary } from '@logicalclocks/quartz';
import useScreenWithScroll from '../../../../hooks/useScreenWithScroll';

export interface JobsStickySummaryProps {
  onSubmit: () => void;
  isEdit?: boolean;
  disabled: boolean;
  errorsValue: string;
}

const JobsStickySummary: FC<JobsStickySummaryProps> = ({
  onSubmit,
  isEdit,
  disabled,
  errorsValue,
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
          {!isEdit && 'Create New Job'}
          {isEdit && 'Save'}
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

export default memo(JobsStickySummary);

// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import { Button, StickySummary } from '@logicalclocks/quartz';
import useScreenWithScroll from '../../../../hooks/useScreenWithScroll';
import { FormType } from '../types';

export interface JobsStickySummaryProps {
  onSubmit: () => void;
  isEdit?: boolean;
  disabled: boolean;
  errorsValue: string;
  formType: FormType;
  canSave?: boolean;
}

const JobsStickySummary: FC<JobsStickySummaryProps> = ({
  onSubmit,
  isEdit,
  formType,
  disabled,
  canSave,
  errorsValue,
}) => {
  const { watch } = useFormContext();

  const navigate = useNavigate();
  const { appName } = watch(['appName']);
  const hasScrollOnScreen = useScreenWithScroll();

  const isJob = formType === FormType.JOB;

  return (
    <StickySummary
      mainButton={
        <Button
          disabled={disabled || !canSave}
          intent="primary"
          type="submit"
          onClick={onSubmit}
        >
          {isJob && (isEdit ? 'Save' : 'Create New Job')}
          {!isJob && 'Save'}
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
      title={appName}
      errorsValue={errorsValue}
      hasScrollOnScreen={hasScrollOnScreen}
    />
  );
};

export default memo(JobsStickySummary);

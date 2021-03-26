import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import { Button, StickySummary } from '@logicalclocks/quartz';
import { ExpectationType } from './ExpectationForm';

export interface ExpectationSummaryProps {
  isEdit?: boolean;
  disabled: boolean;
  onSubmit: () => void;
  type: ExpectationType;
  disabledMainButton?: boolean;
}

const ExpectationSummary: FC<ExpectationSummaryProps> = ({
  type,
  isEdit,
  disabled,
  onSubmit,
  disabledMainButton,
}) => {
  const { watch } = useFormContext();

  const navigate = useNavigate();

  const { name } = watch(['name']);

  return (
    <StickySummary
      mainButton={
        <Button
          type="submit"
          intent="primary"
          onClick={onSubmit}
          disabled={disabled || disabledMainButton}
        >
          {isEdit
            ? 'Save and attach expectation'
            : type === ExpectationType.existing
            ? 'Attach expectation'
            : 'Create and attach expectation'}
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

export default ExpectationSummary;

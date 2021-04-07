import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import { Button, StickySummary } from '@logicalclocks/quartz';
import { ExpectationType } from './ExpectationForm';
import useScreenWithScroll from '../../../hooks/useScreenWithScroll';

export interface ExpectationSummaryProps {
  isEdit?: boolean;
  disabled: boolean;
  onSubmit: () => void;
  type: ExpectationType;
  disabledMainButton?: boolean;
  errorsValue?: string;
}

const ExpectationSummary: FC<ExpectationSummaryProps> = ({
  type,
  isEdit,
  disabled,
  onSubmit,
  errorsValue,
  disabledMainButton,
}) => {
  const { watch } = useFormContext();

  const navigate = useNavigate();
  const hasScrollOnScreen = useScreenWithScroll();
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
      hasScrollOnScreen={hasScrollOnScreen}
      errorsValue={errorsValue}
    />
  );
};

export default ExpectationSummary;

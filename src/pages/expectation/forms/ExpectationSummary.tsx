// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import { Button, StickySummary } from '@logicalclocks/quartz';
import useScreenWithScroll from '../../../hooks/useScreenWithScroll';
import { ExpectationType } from '../types';

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

  const existingMsg =
    type === ExpectationType.existing
      ? 'Attach expectation'
      : 'Create and attach expectation';
  const isEditMsg = isEdit ? 'Save and attach expectation' : existingMsg;

  return (
    <StickySummary
      mainButton={
        <Button
          type="submit"
          intent="primary"
          onClick={onSubmit}
          disabled={disabled || disabledMainButton}
        >
          {isEditMsg}
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

import { Box, Flex } from 'rebass';
import { useFieldArray, useFormContext } from 'react-hook-form';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import {
  CardSecondary,
  Button,
  Input,
  graphColors,
  InputValidation,
  Callout,
  CalloutTypes,
} from '@logicalclocks/quartz';
import { argumentRowStyles } from '../../storage-connectors/forms/jdbc-form.styles';

import { progressBarStyles } from './split.styles';
import getInputValidation from '../../../../utils/getInputValidation';

export interface SplitsFormProps {
  isDisabled: boolean;
}

const SplitsForm: FC<SplitsFormProps> = ({ isDisabled }) => {
  const [isActive, setIsActive] = useState(false);

  const { control, register, errors, watch, setValue } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'splits',
  });

  const handleAddSplits = useCallback(() => {
    setValue('splits', [
      {
        name: '',
        percentage: '',
      },
      {
        name: '',
        percentage: '',
      },
    ]);

    setIsActive(true);
  }, [setValue]);

  useEffect(() => {
    if (errors.splits) {
      setError(errors.splits?.message);
    } else {
      setError('');
    }
  }, [errors]);

  const [error, setError] = useState('');

  const splits = watch().splits;

  const intent = useMemo(() => {
    const sum = splits.reduce(
      (acc: number, cur: { percentage: string }) => acc + +cur.percentage,
      0,
    );

    if (sum === 100) {
      return 'success';
    }

    return sum < 100 ? 'neutral' : 'warning';
  }, [splits]);

  if (!isActive) {
    return (
      <CardSecondary title="Splits" mb="20px">
        <Button onClick={handleAddSplits}>Configure splits</Button>
      </CardSecondary>
    );
  }

  return (
    <CardSecondary title="Splits" mb="20px">
      {!!error && (
        <Box mb="20px">
          <Callout content={error} type={CalloutTypes.error} />
        </Box>
      )}

      {fields.map((item, index) => {
        const inputErrors = (errors.splits || [])[index];

        return (
          <Flex sx={argumentRowStyles} key={item.id} alignItems="flex-end">
            <Flex mb={!!inputErrors ? '20px' : 0} key={item.id} mt="8px">
              <Input
                defaultValue={item.name}
                label={!index ? 'Name' : ''}
                name={`splits[${index}].name`}
                disabled={isDisabled}
                placeholder={`Split ${index + 1}`}
                ref={register()}
                {...getInputValidation(`name`, inputErrors)}
              />
              <Box
                sx={{
                  span: {
                    mb: '0 !important',
                  },
                }}
              >
                <Input
                  labelProps={{
                    ml: '8px',
                  }}
                  mt={!index ? '8px' : 0}
                  defaultValue={item.percentage}
                  label={!index ? 'Proportion (percent)' : ''}
                  name={`splits[${index}].percentage`}
                  disabled={isDisabled}
                  placeholder="10"
                  ref={register()}
                  {...getInputValidation(`percentage`, inputErrors)}
                />
              </Box>
            </Flex>
            {index > 1 && (
              <Box
                sx={{
                  button: {
                    alignItems: 'center',
                  },
                }}
              >
                <Button
                  height="32px"
                  intent="ghost"
                  disabled={isDisabled}
                  onClick={() => remove(index)}
                >
                  <svg
                    width="10"
                    height="9"
                    viewBox="0 0 10 9"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.63155 0.437C1.40375 0.216313 1.0344 0.216313 0.806597 0.437C0.578791 0.657687 0.578791 1.01549 0.806597 1.23618L4.17519 4.4995L0.806631 7.7628C0.578826 7.98348 0.578826 8.34129 0.806631 8.56198C1.03444 8.78266 1.40378 8.78266 1.63159 8.56198L5.00015 5.29868L8.36871 8.56198C8.59652 8.78266 8.96586 8.78266 9.19367 8.56198C9.42148 8.34129 9.42148 7.98348 9.19367 7.7628L5.82511 4.4995L9.1937 1.23618C9.42151 1.01549 9.42151 0.657687 9.1937 0.437C8.9659 0.216313 8.59655 0.216313 8.36875 0.437L5.00015 3.70033L1.63155 0.437Z"
                      fill="black"
                    />
                  </svg>
                </Button>
              </Box>
            )}
          </Flex>
        );
      })}

      <Button
        mt="8px"
        intent="ghost"
        onClick={() => {
          append({ name: '', percentage: '' });
        }}
      >
        Add a split
      </Button>

      <Flex mt="20px" backgroundColor="grayShade3" width="100%" height="10px">
        {splits.map(({ percentage }: { percentage: string }, ind: number) => (
          <Box
            key={'bar-' + ind}
            sx={progressBarStyles(+percentage, graphColors[ind])}
          />
        ))}
      </Flex>

      <Box mt="8px">
        <InputValidation intent={intent}>
          The sum off all splits is{' '}
          {splits.reduce(
            (acc: number, cur: { percentage: string }) => acc + +cur.percentage,
            0,
          )}
          %
        </InputValidation>
      </Box>
    </CardSecondary>
  );
};

export default SplitsForm;

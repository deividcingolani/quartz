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
  IconButton,
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
                ml="8px"
              >
                <IconButton
                  tooltip="Remove"
                  intent="ghost"
                  icon="times"
                  onClick={() => remove(index)}
                />
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
          The sum off all splits is
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

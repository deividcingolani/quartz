// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, useEffect } from 'react';
import { Box, Flex } from 'rebass';
import { Controller, useFormContext } from 'react-hook-form';
import { Checkbox, Icon, Tooltip } from '@logicalclocks/quartz';

export interface StatisticConfigurationFormProps {
  isLoading: boolean;
}

const StatisticConfigurationForm: FC<StatisticConfigurationFormProps> = ({
  isLoading,
}) => {
  const { watch, setValue, control } = useFormContext();

  const { enabled } = watch(['enabled']);

  useEffect(() => {
    if (!enabled) {
      setValue('histograms', false);
      setValue('correlations', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return (
    <>
      <Flex>
        <Controller
          control={control}
          name="enabled"
          render={({ onChange, value }) => (
            <Box mb="8px">
              <Checkbox
                checked={value}
                label="enable statistics"
                disabled={isLoading}
                onChange={() => onChange(!value)}
              />
            </Box>
          )}
        />

        <Box ml="8px">
          <Tooltip mainText="Includes descriptive statistics">
            <Icon icon="info-circle" size="sm" />
          </Tooltip>
        </Box>
      </Flex>

      <Controller
        control={control}
        name="histograms"
        render={({ onChange, value }) => (
          <Box mb="8px">
            <Checkbox
              checked={value}
              label="histograms"
              disabled={!enabled || isLoading}
              onChange={() => onChange(!value)}
            />
          </Box>
        )}
      />

      <Controller
        control={control}
        name="correlations"
        render={({ onChange, value }) => (
          <Box mb="20px">
            <Checkbox
              checked={value}
              disabled={!enabled || isLoading}
              label="correlations"
              onChange={() => onChange(!value)}
            />
          </Box>
        )}
      />
    </>
  );
};

export default memo(StatisticConfigurationForm);

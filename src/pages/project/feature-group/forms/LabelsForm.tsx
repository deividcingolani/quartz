import React, { FC, memo, useMemo } from 'react';
import { Box, Flex } from 'rebass';
import { Controller } from 'react-hook-form';
import {
  Button,
  Callout,
  CalloutTypes,
  Label,
  Select,
} from '@logicalclocks/quartz';
// Hooks
import { useSelector } from 'react-redux';
// Types
import { FeatureFormProps } from '../types';
import { FeatureGroup } from '../../../../types/feature-group';
// Selectors
import { selectFeatureGroupsData } from '../../../../store/models/feature/selectors';
import Divider from '../../../../components/divider/Devider';

const LabelsForm: FC<FeatureFormProps> = ({ control, isDisabled }) => {
  const { data, isLoading } = useSelector(selectFeatureGroupsData);

  const labels = useMemo(
    () =>
      data
        .reduce(
          (acc: string[], { labels: fgLabels = [] }: FeatureGroup) => [
            ...acc,
            ...fgLabels,
          ],
          [],
        )
        .filter((item, pos, arr) => {
          return arr.indexOf(item) === pos;
        }),
    [data],
  );

  return (
    <Box mt="20px">
      <Label mb="4px">Labels</Label>
      <Controller
        control={control}
        name="labels"
        render={({ onChange, value }) => (
          <Select
            width="100%"
            placeholder="labels"
            isMulti
            options={labels}
            value={value}
            noDataMessage={
              isLoading
                ? 'loading...'
                : labels.length
                ? 'no labels attached'
                : 'this project has no labels defined'
            }
            disabled={!labels.length || isDisabled}
            onChange={(val) => onChange(val)}
          />
        )}
      />
      <Callout
        css={{ marginTop: '10px' }}
        content={
          <Flex alignItems="center">
            <Label>In order to add a new label, follow the instructions</Label>
            <Button
              onClick={() =>
                window.open(
                  'https://hopsworks.readthedocs.io/en/stable/featurestore/guides/featurestore.html?highlight=tags#tagging-feature-groups-and-training-datasets',
                  '_blank',
                )
              }
              pl="3px"
              intent="inline"
            >
              here↗
            </Button>
          </Flex>
        }
        type={CalloutTypes.neutral}
      />
      <Divider mt="20px" ml="-20px" />
    </Box>
  );
};

export default memo(LabelsForm);

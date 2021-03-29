import React, { FC } from 'react';
import { Box, Flex } from 'rebass';
import { Input, Select, Tooltip } from '@logicalclocks/quartz';

import { FeatureGroupFilter } from '../../types';
import { FeatureGroup } from '../../../../../types/feature-group';

import icons from '../../../../../sources/icons';
import { useFormContext } from 'react-hook-form';
import getInputValidation from '../../../../../utils/getInputValidation';

export interface SingleFilterProps {
  index: number;
  isDisabled: boolean;
  options: FeatureGroup[];
  filter: FeatureGroupFilter;
  onDelete: (index: number) => () => void;
  changeProperty: (index: number, field: string, value: any) => void;
}

const SingleFilter: FC<SingleFilterProps> = ({
  index,
  filter,
  onDelete,
  changeProperty,
  isDisabled,
  options,
}) => {
  const { errors } = useFormContext();

  const { filters } = errors;

  const errorFilter = filters && filters.length && filters[index];

  return (
    <Flex mb="20px" justifyContent="space-between">
      <Flex flex={1} mr="20px">
        <Select
          listWidth="100%"
          height="fit-content"
          disabled={isDisabled}
          label="Feature group"
          hasPlaceholder={false}
          placeholder="pick a feature group"
          options={options.map(({ name }) => name)}
          value={filter.fg?.name ? [filter.fg?.name] : []}
          onChange={(value) => {
            const fg = options.find(({ name }) => name === value[0]);

            if (fg) {
              changeProperty(index, 'fg', fg);
            }
          }}
          {...getInputValidation('fg', errorFilter)}
        />
        <Select
          ml="8px"
          flex={1}
          label="Feature"
          listWidth="100%"
          height="fit-content"
          disabled={isDisabled}
          hasPlaceholder={false}
          placeholder="pick a feature"
          value={filter.features || []}
          noDataMessage="pick a feature"
          onChange={(value) => changeProperty(index, 'features', value)}
          options={filter.fg?.features.map(({ name }) => name) || []}
          {...getInputValidation('features', errorFilter)}
        />
        <Select
          mx="8px"
          listWidth="100%"
          label="Operation"
          height="fit-content"
          disabled={isDisabled}
          hasPlaceholder={false}
          value={filter.operation}
          placeholder="pick a operation"
          options={['>', '≥', '!=', '=', '≤', '<']}
          onChange={(value) => changeProperty(index, 'operation', value)}
        />
        <Input
          label="Value"
          placeholder="0"
          height="fit-content"
          value={filter.value}
          disabled={isDisabled}
          onChange={({ target }) =>
            changeProperty(index, 'value', target.value)
          }
          {...getInputValidation('value', errorFilter)}
        />
      </Flex>
      <Tooltip mt="22px" mainText="Remove">
        <Box
          p="8px"
          height="32px"
          width="32px"
          sx={{
            cursor: 'pointer',
            backgroundColor: '#ffffff',
            transition: 'all .4s ease',

            ':hover': {
              backgroundColor: 'grayShade3',
            },

            svg: {
              width: '16px',
              height: '16px',
            },
          }}
          onClick={() => {
            if (!isDisabled) {
              onDelete(index)();
            }
          }}
        >
          {icons.cross}
        </Box>
      </Tooltip>
    </Flex>
  );
};

export default SingleFilter;

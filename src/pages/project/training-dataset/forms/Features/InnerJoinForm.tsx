import { Box } from 'rebass';
import React, { FC } from 'react';

import SingleInnerJoinForm from './SingleInnerJoinForm';
import { FeatureGroupJoin } from '../../types';
import { FeatureGroup } from '../../../../../types/feature-group';

export interface InnerJoinFormProps {
  isDisabled: boolean;
  options: FeatureGroup[];
  items: FeatureGroupJoin[];
  handleChange: (index: number, field: string, value: any) => void;
}

const InnerJoinForm: FC<InnerJoinFormProps> = ({
  items,
  options,
  handleChange,
  isDisabled,
}) => {
  return (
    <Box>
      {items.map((join, index) => (
        <SingleInnerJoinForm
          join={join}
          key={join.id}
          index={index}
          items={items}
          options={options}
          isDisabled={isDisabled}
          handleChange={handleChange}
          title={items.length > 1 ? `#${index + 1} inner join` : ''}
        />
      ))}
    </Box>
  );
};

export default InnerJoinForm;

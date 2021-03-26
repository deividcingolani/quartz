import { Flex } from 'rebass';
import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { CardSecondary } from '@logicalclocks/quartz';

import Rules from './Rules';
import Attached from './Attached';
import Features from './Features';
import { Expectation } from '../../../../types/expectation';

export interface UpdatesFormProps {
  data: Expectation;
}

const UpdatesForm: FC<UpdatesFormProps> = ({ data }) => {
  const { watch } = useFormContext();

  const { features, rules, featureGroups } = watch([
    'features',
    'rules',
    'featureGroups',
  ]);

  return (
    <CardSecondary readOnly={true} mt="20px" title="Updates">
      <Flex>
        <Attached prevData={data.attachedFeatureGroups} data={featureGroups} />
        <Features prevData={data.features} data={features} />
        <Rules prevData={data.rules} data={rules} />
      </Flex>
    </CardSecondary>
  );
};

export default UpdatesForm;

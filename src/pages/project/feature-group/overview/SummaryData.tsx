import React, { FC, memo, useMemo } from 'react';
import { Flex } from 'rebass';
import { Text, TextValueBadge, Badge, User } from '@logicalclocks/quartz';

// Services
import ProfileService from '../../../../services/ProfileService';
// Types
import {
  FeatureGroup,
  FeatureGroupLabel,
} from '../../../../types/feature-group';
// Components
import CardLabels from '../list/CardLabels';
import DateValue from '../list/DateValue';

export interface SummaryDataProps {
  data: FeatureGroup;
  isLabelsLoading: boolean;
  labels: FeatureGroupLabel[];
}

const SummaryData: FC<SummaryDataProps> = ({
  data,
  isLabelsLoading,
  labels,
}) => {
  const labelsFormatted = useMemo(() => {
    return labels.map(({ name }) => name);
  }, [labels]);

  const featureCount = data.features.length;

  return (
    <>
      <Flex>
        <User
          photo={ProfileService.avatar(String(data.creator))}
          name={data.creator}
        />
        <DateValue
          ml="23px"
          label="Creation"
          date={data?.created ? new Date(data?.created) : new Date()}
        />
        <DateValue
          ml="50px"
          label="Last update"
          date={data?.created ? new Date(data?.created) : new Date()}
        />
      </Flex>
      <Flex mt="17px">
        <TextValueBadge variant="gray" text="features" value={featureCount} />
        <TextValueBadge variant="gray" ml="20px" text="rows" value="81M" />
        <TextValueBadge variant="gray" ml="20px" text="commits" value={32} />
        <TextValueBadge
          variant="gray"
          ml="20px"
          text="training datasets"
          value={32}
        />
      </Flex>
      <Text my="20px">{data?.description || 'No Description'}</Text>
      <Flex>
        {labelsFormatted.length ? (
          <CardLabels labels={labelsFormatted} isLoading={isLabelsLoading} />
        ) : (
          <Badge variant="bold" value="No Labels" />
        )}
      </Flex>
    </>
  );
};

export default memo(SummaryData);

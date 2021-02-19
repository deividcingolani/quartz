import React, { FC, memo } from 'react';
import { Flex } from 'rebass';
import {
  Microlabeling,
  Text,
  TextValueBadge,
  User,
  Value,
  Labeling,
} from '@logicalclocks/quartz';

import {
  TrainingDataset,
  TrainingDatasetType,
} from '../../../../types/training-dataset';
import DateValue from '../../feature-group/list/DateValue';
import ProfileService from '../../../../services/ProfileService';

export interface TdOverviewSummaryDataProps {
  data: TrainingDataset;
}

const TrainingDatasetOverviewSummary: FC<TdOverviewSummaryDataProps> = ({
  data,
}) => {
  return (
    <>
      <Flex>
        <User
          name={data?.creator}
          photo={ProfileService.avatar(data?.creator)}
        />
        <DateValue
          ml="23px"
          label="Creation"
          date={data?.created ? new Date(data?.created) : new Date()}
        />
        <DateValue
          ml="50px"
          label="Last updated"
          date={data?.created ? new Date(data?.created) : new Date()}
        />
        <Flex flexDirection="column" ml="50px">
          <Microlabeling mb="3px" gray>
            Location
          </Microlabeling>
          <Value primary>
            {data.trainingDatasetType === TrainingDatasetType.hopsfs
              ? 'local'
              : 'external'}
          </Value>
        </Flex>
        <Flex flexDirection="column" ml="50px">
          <Microlabeling mb="3px" gray>
            Format
          </Microlabeling>
          <Value primary>{data.dataFormat}</Value>
        </Flex>
      </Flex>
      <Flex flexDirection="column" ml="56px" mt="5px">
        <Microlabeling mb="3px" gray>
          Location
        </Microlabeling>
        <Value primary>{data.location}</Value>
      </Flex>
      <Flex mt="17px">
        <TextValueBadge
          variant="gray"
          text="features"
          value={data.features.length}
        />
        <TextValueBadge
          variant="gray"
          ml="20px"
          text="splits"
          value={data?.splits.length || 0}
        />
      </Flex>
      {!!data.description ? (
        <Text my="20px">{data?.description}</Text>
      ) : (
        <Labeling mt="20px" gray>
          -
        </Labeling>
      )}
    </>
  );
};

export default memo(TrainingDatasetOverviewSummary);

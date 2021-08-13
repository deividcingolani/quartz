// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, useCallback } from 'react';
import { Flex } from 'rebass';
import {
  Microlabeling,
  Text,
  TextValueBadge,
  User,
  Value,
  Labeling,
} from '@logicalclocks/quartz';

import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  TrainingDataset,
  TrainingDatasetType,
} from '../../../../types/training-dataset';
import DateValue from '../../feature-group/list/DateValue';
import KeywordsEditor from '../../../../components/keywords-editor/KeywordsEditor';
import { Dispatch, RootState } from '../../../../store';

export interface TdOverviewSummaryDataProps {
  data: TrainingDataset;
  canEdit: boolean;
}

const TrainingDatasetOverviewSummary: FC<TdOverviewSummaryDataProps> = ({
  data,
  canEdit,
}) => {
  const { id: projectId, tdId: id, fsId } = useParams();

  const dispatch = useDispatch<Dispatch>();

  const keywordsSaveHandler = useCallback(
    async (keywords) => {
      await dispatch.trainingDatasetLabels.attachLabels({
        projectId: +projectId,
        trainingDatasetId: +id,
        featureStoreId: +fsId,
        data: keywords,
      });
    },
    [fsId, dispatch, id, projectId],
  );

  const isLoading = useSelector(
    (state: RootState) =>
      state.loading.effects.trainingDatasetView.loadRemainingData,
  );

  return (
    <>
      <Flex>
        <User
          firstName={data?.creator.firstName}
          lastName={data?.creator.lastName}
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
      {data.description ? (
        <Text my="20px">{data?.description}</Text>
      ) : (
        <Labeling mt="20px" gray>
          -
        </Labeling>
      )}

      {isLoading ? (
        <Labeling gray>loading...</Labeling>
      ) : (
        <KeywordsEditor
          isDisabled={!canEdit}
          onSave={keywordsSaveHandler}
          value={data.labels}
        />
      )}
    </>
  );
};

export default memo(TrainingDatasetOverviewSummary);

import React, { FC, memo, useCallback } from 'react';
import { Flex } from 'rebass';
import { Text, TextValueBadge, User } from '@logicalclocks/quartz';

// Services
import ProfileService from '../../../../services/ProfileService';
// Types
import { FeatureGroup } from '../../../../types/feature-group';
// Components
import DateValue from '../list/DateValue';
import KeywordsEditor from '../../../../components/keywords-editor/KeywordsEditor';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch, RootState } from '../../../../store';

export interface SummaryDataProps {
  data: FeatureGroup;
}

const SummaryData: FC<SummaryDataProps> = ({ data }) => {
  const { id: projectId, fgId: id } = useParams();

  const featureStoreData = useSelector((state: RootState) =>
    state.featureStores?.length ? state.featureStores[0] : null,
  );

  const dispatch = useDispatch<Dispatch>();

  const featureCount = data.features.length;

  const keywordsSaveHandler = useCallback(
    async (keywords) => {
      if (featureStoreData?.featurestoreId) {
        await dispatch.featureGroupLabels.attachLabels({
          projectId: +projectId,
          featureGroupId: +id,
          featureStoreId: featureStoreData.featurestoreId,
          data: keywords,
        });
      }
    },
    [featureStoreData, dispatch, id, projectId],
  );

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

      <KeywordsEditor onSave={keywordsSaveHandler} value={data.labels} />
    </>
  );
};

export default memo(SummaryData);

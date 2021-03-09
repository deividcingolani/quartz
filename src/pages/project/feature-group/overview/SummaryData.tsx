import React, { FC, memo, useCallback } from 'react';
import { Flex } from 'rebass';
import {
  Text,
  TextValueBadge,
  User,
  Labeling,
  Microlabeling,
  Value,
} from '@logicalclocks/quartz';

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

  const isLoading = useSelector(
    (state: RootState) =>
      state.loading.effects.featureGroupView.loadRemainingData,
  );

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
          ml="20px"
          label="Last updated"
          date={data?.created ? new Date(data?.created) : new Date()}
        />
        <Flex ml="20px" flexDirection="column">
          <Microlabeling mb="3px" gray>
            Mode
          </Microlabeling>
          <Value primary>{data.onlineEnabled ? 'online' : 'offline'}</Value>
        </Flex>
      </Flex>
      <Flex mt="17px" alignItems="center">
        <TextValueBadge variant="gray" text="features" value={featureCount} />
        {/*<TextValueBadge variant="gray" ml="20px" text="rows" value="81M" />*/}
        {isLoading ? (
          <Labeling ml="8px" gray>
            loading...
          </Labeling>
        ) : (
          <Flex>
            <TextValueBadge
              variant="gray"
              ml="8px"
              text="commits"
              value={data.commits?.length}
            />
            <TextValueBadge
              variant="gray"
              ml="8px"
              text="training datasets"
              value={data.provenance?.length}
            />
          </Flex>
        )}
        {!!data.timeTravelFormat && (
          <TextValueBadge
            ml="8px"
            variant="gray"
            text="time travel"
            value={data.timeTravelFormat?.toLowerCase()}
          />
        )}
      </Flex>
      {!!data.description ? (
        <Text my="20px">{data?.description || '-'}</Text>
      ) : (
        <Labeling my="20px" gray>
          -
        </Labeling>
      )}

      {isLoading ? (
        <Labeling gray>loading...</Labeling>
      ) : (
        <KeywordsEditor onSave={keywordsSaveHandler} value={data.labels} />
      )}
    </>
  );
};

export default memo(SummaryData);

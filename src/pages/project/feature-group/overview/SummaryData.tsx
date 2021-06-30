// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, useCallback, useMemo } from 'react';
import { Box, Flex } from 'rebass';
import {
  Text,
  TextValueBadge,
  User,
  Labeling,
  Microlabeling,
  Value,
  CalloutTypes,
  Callout,
  Button,
} from '@logicalclocks/quartz';

// Services
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProfileService from '../../../../services/ProfileService';
// Types
import { FeatureGroup } from '../../../../types/feature-group';
// Components
import DateValue from '../list/DateValue';
import KeywordsEditor from '../../../../components/keywords-editor/KeywordsEditor';
import { Dispatch, RootState } from '../../../../store';
import routeNames from '../../../../routes/routeNames';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import useGetHrefForRoute from '../../../../hooks/useGetHrefForRoute';
import { NodeTypes } from '../../../../components/provenance/types';

export interface SummaryDataProps {
  data: FeatureGroup;
}

const SummaryData: FC<SummaryDataProps> = ({ data }) => {
  const { id: projectId, fgId: id } = useParams();

  const featureStoreData = useSelector((state: RootState) =>
    state.featureStores?.length ? state.featureStores[0] : null,
  );

  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigateRelative();
  const getHref = useGetHrefForRoute();

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

  const handleNavigate = useCallback(
    (connectorName: string, route: string) => (): void => {
      navigate(
        route.replace(':connectorName', connectorName),
        routeNames.project.view,
      );
    },
    [navigate],
  );

  const handleHref = (connectorName: string, route: string): string => {
    return getHref(
      route.replace(':connectorName', connectorName),
      routeNames.project.view,
    );
  };

  const tdsCount = useMemo(() => {
    if (isLoading) return 0;
    const ups = data.provenance.upstream.nodes.filter(
      (n) => n.type === NodeTypes.trainingDataset,
    ).length;
    const downs = data.provenance.downstream.nodes.filter(
      (n) => n.type === NodeTypes.trainingDataset,
    ).length;
    return ups + downs;
  }, [data.provenance, isLoading]);

  return (
    <>
      <Flex>
        <User
          photo={ProfileService.avatar(String(data.creator))}
          name="data.creator.firstName"
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
          <Value primary>
            {data.type === 'cachedFeaturegroupDTO' ? 'cached' : 'on-demand'}
          </Value>
        </Flex>
        {data.type === 'cachedFeaturegroupDTO' && (
          <Flex ml="20px" flexDirection="column">
            <Microlabeling mb="3px" gray>
              Online
            </Microlabeling>
            <Value primary>{data.onlineEnabled ? 'true' : 'false'}</Value>
          </Flex>
        )}
        {data.type === 'onDemandFeaturegroupDTO' && (
          <Flex ml="20px" flexDirection="column">
            <Microlabeling mb="3px" gray>
              Storage Connector
            </Microlabeling>
            <Button
              p={0}
              intent="inline"
              href={handleHref(
                data.storageConnector.name,
                routeNames.storageConnector.edit,
              )}
              onClick={handleNavigate(
                data.storageConnector.name,
                routeNames.storageConnector.edit,
              )}
            >
              {data.storageConnector.name} ↗
            </Button>
          </Flex>
        )}
      </Flex>
      {data.timeTravelFormat === undefined ||
        data.timeTravelFormat === 'NONE' ||
        (!isLoading && data.commits?.length === 0 && (
          <Box my="20px">
            <Callout
              content="This feature group does not contain any data"
              type={CalloutTypes.warning}
            />
          </Box>
        ))}
      <Flex mt="17px" alignItems="center">
        <TextValueBadge variant="gray" text="features" value={featureCount} />
        {/* <TextValueBadge variant="gray" ml="20px" text="rows" value="81M" /> */}
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
              value={tdsCount}
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
        <TextValueBadge
          variant="gray"
          ml="8px"
          text="data validation"
          value={data.validationType?.toLowerCase() ?? 'none'}
        />
      </Flex>
      {data.description ? (
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

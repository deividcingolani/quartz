import React, { FC, memo, useCallback, useMemo } from 'react';
import { Flex } from 'rebass';
import {
  Avatar,
  Select,
  Text,
  TextValueBadge,
  Badge,
} from '@logicalclocks/quartz';

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
import { useSelector } from 'react-redux';
import { selectFeatureStoreData } from '../../../../store/models/feature/selectors';
import useFeatureGroups from '../hooks/useFeatureGroups';
import { useParams } from 'react-router-dom';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import routeNames from '../../../../routes/routeNames';

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
  const { id: projectId } = useParams();

  const labelsFormatted = useMemo(() => {
    return labels.map(({ name }) => name);
  }, [labels]);

  const featureCount = data.features.length;

  const navigate = useNavigateRelative();

  const { data: featureStoreData } = useSelector(selectFeatureStoreData);

  const { data: featureGroups } = useFeatureGroups(
    +projectId,
    featureStoreData?.featurestoreId,
  );

  const versions = featureGroups
    .filter((fg) => fg.name === data?.name)
    .map((fg) => fg.version.toString());

  const handleVersionChange = useCallback(
    (version: string[]) => {
      const id = featureGroups.find((fg) => fg.version === +[version])?.id;
      if (id) {
        navigate(
          '/fg/:fgId'.replace(':fgId', id.toString()),
          routeNames.project.view,
        );
      }
    },
    [featureGroups, navigate],
  );

  return (
    <>
      <Flex>
        <Avatar src={ProfileService.avatar(String(data?.creator))} />
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
        <Select
          width="143px"
          listWidth="100%"
          ml="43px"
          value={[data.version.toString()]}
          variant="white"
          options={versions || []}
          placeholder="current version"
          onChange={handleVersionChange}
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

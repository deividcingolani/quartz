import React, { FC, memo, useCallback, useMemo } from 'react';
import { Box } from 'rebass';
import { useSelector } from 'react-redux';

import { Button, Select } from '@logicalclocks/quartz';
import { TrainingDataset } from '../../../../types/training-dataset';

// Components
import Panel from '../../../../components/panel/Panel';
import TrainingDatasetOverviewSummary from './TrainingDatasetOverviewSummary';
import Anchor from '../../../../components/anchor/Anchor';
import routeNames from '../../../../routes/routeNames';
import TrainingDatasetFeatureList from './TrainingDatasetFeatureList';
import CodeCard from '../../feature-group/overview/CodeCard';
import { selectFeatureStoreData } from '../../../../store/models/feature/selectors';
import SchematisedTags from '../../feature-group/overview/SchematisedTags';
import Provenance from './Provenance';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import SplitGraph from './SplitGraph';
import { ItemDrawerTypes } from '../../../../components/drawer/ItemDrawer';
import CardBoundary from '../../../../components/error-boundary/CardBoundary';

// Utils
import { useVersionsSort } from '../utils';

export interface TrainingDatasetContentProps {
  data: TrainingDataset;
  onClickRefresh: () => void;
  onClickEdit: () => void;
}

const action = (
  <Button
    p={0}
    intent="inline"
    href="https://docs.hopsworks.ai"
    onClick={() => window.open('https://docs.hopsworks.ai', '_blank')}
  >
    full documentation
  </Button>
);

const {
  featureList,
  provenance,
  schematisedTags,
  splitGraph,
  api,
} = routeNames.overviewAnchors;

const TrainingDatasetOverviewContent: FC<TrainingDatasetContentProps> = ({
  data,
  onClickRefresh,
  onClickEdit,
}) => {
  const { data: featureStoreData } = useSelector(selectFeatureStoreData);

  const apiCode = useMemo(() => {
    return [
      {
        title: 'Python',
        language: 'python',
        code: `import hsfs
connection = hsfs.connection()
fs = connection.get_feature_store(name='${featureStoreData?.featurestoreName}')
td = fs.get_training_dataset('${data.name}', version=${data.version})`,
      },
      {
        title: 'Scala',
        language: 'scala',
        code: `import com.logicalclocks.hsfs._ 
val connection = HopsworksConnection.builder().build();
val fs = connection.getFeatureStore("${featureStoreData?.featurestoreName}");
val td = fs.getTrainingDataset("${data.name}", ${data.version})`,
      },
    ];
  }, [data, featureStoreData]);

  const navigate = useNavigateRelative();

  const latestVersion = useMemo(
    () => Math.max(...(data?.versions?.map(({ version }) => version) || [])),
    [data],
  );

  const versions = useVersionsSort(data, latestVersion);

  const handleVersionChange = useCallback(
    (values) => {
      const ver = values[0].includes(' ')
        ? +values[0].slice(0, values[0].indexOf(' '))
        : +values[0];

      const newId = data?.versions?.find(({ version }) => version === ver)?.id;

      if (newId) {
        navigate(`/td/${newId}`, routeNames.project.view);
      }
    },
    [data, navigate],
  );

  return (
    <>
      <Panel
        title={String(data?.name)}
        id={data.id}
        onClickEdit={onClickEdit}
        onClickRefresh={onClickRefresh}
        idColor="labels.purple"
        hasVersionDropdown
        versionDropdown={
          <Select
            mb="-5px"
            width="143px"
            listWidth="100%"
            value={[
              `${data?.version.toString()} ${
                data?.version === latestVersion ? '(latest)' : ''
              }`,
            ]}
            options={versions}
            placeholder="version"
            onChange={handleVersionChange}
          />
        }
      />
      <Box mb="20px" mt="55px" width="100%">
        <TrainingDatasetOverviewSummary data={data} />
        <Anchor groupName="tdOverview" anchor={featureList}>
          <CardBoundary mt="20px" title="Feature list">
            <TrainingDatasetFeatureList data={data} />
          </CardBoundary>
        </Anchor>

        <Anchor groupName="tdOverview" anchor={provenance}>
          <CardBoundary mt="20px" title="Provenance">
            <Provenance data={data.provenance} />
          </CardBoundary>
        </Anchor>

        <Anchor groupName="tdOverview" anchor={schematisedTags}>
          <CardBoundary mt="20px" title="Tags">
            <SchematisedTags type={ItemDrawerTypes.td} data={data.tags} />
          </CardBoundary>
        </Anchor>

        <Anchor groupName="tdOverview" anchor={api}>
          <CardBoundary mt="20px" title="API">
            <CodeCard
              mb="20px"
              mt="20px"
              title="API"
              actions={action}
              content={apiCode}
            />
          </CardBoundary>
        </Anchor>

        <Anchor groupName="tdOverview" anchor={splitGraph}>
          <SplitGraph graph={data.splits} />
        </Anchor>
      </Box>
    </>
  );
};

export default memo(TrainingDatasetOverviewContent);

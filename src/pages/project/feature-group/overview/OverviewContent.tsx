import { Box } from 'rebass';
import React, { FC, memo, useCallback, useMemo } from 'react';
import { Button, Select } from '@logicalclocks/quartz';

// Components
import { useSelector } from 'react-redux';
import Anchor from '../../../../components/anchor/Anchor';
import routeNames from '../../../../routes/routeNames';
import CodeCard from './CodeCard';
import Panel from '../../../../components/panel/Panel';

// Types
import { FeatureGroup } from '../../../../types/feature-group';
// Features
import SummaryData from './SummaryData';
import PipelineHistory from './PipelineHistory';
import SchematisedTags from './SchematisedTags';
import Provenance from './Provenance';
import FeatureList from './FeatureList';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import { RootState } from '../../../../store';
import { selectFeatureStoreData } from '../../../../store/models/feature/selectors';
import { useLatestVersion } from '../../../../hooks/useLatestVersion';
import { ItemDrawerTypes } from '../../../../components/drawer/ItemDrawer';

export interface ContentProps {
  data: FeatureGroup;
  onClickRefresh: () => void;
  onClickEdit: () => void;
}

const action = (
  <Button
    p={0}
    intent="inline"
    onClick={() => window.open('https://docs.hopsworks.ai/', '_blank')}
  >
    full documentation
  </Button>
);

const {
  featureList,
  provenance,
  schematisedTags,
  pipelineHistory,
  runningCode,
  api,
} = routeNames.overviewAnchors;

const OverviewContent: FC<ContentProps> = ({
  data,
  onClickRefresh,
  onClickEdit,
}) => {
  const runningCodes = useMemo(() => {
    return [
      {
        title: 'Snippet',
        code: `SELECT ‘${data.name}’.’home_team_id’, ‘${data.name}’.
FROM ‘demo_featurestore_admin000’
INNER JOIN ‘demo_featurestore’`,
      },
    ];
  }, [data]);

  const { data: featureStoreData } = useSelector(selectFeatureStoreData);

  const apiCode = useMemo(() => {
    return [
      {
        title: 'Python',
        code: `import hsfs
connection = hsfs.connection()
fs = connection.get_feature_store(name='${featureStoreData?.featurestoreName}')
fg = fs.get_feature_group('${data.name}', version=${data.version})`,
      },
      {
        title: 'Scala',
        code: `import com.logicalclocks.hsfs._ 
val connection = HopsworksConnection.builder().build();
val fs = connection.getFeatureStore("${featureStoreData?.featurestoreName}");
val fg = fs.getFeatureGroup("${data.name}", ${data.version})`,
      },
    ];
  }, [data, featureStoreData]);

  const navigate = useNavigateRelative();

  const featureGroups = useSelector((state: RootState) => state.featureGroups);

  const { latestVersion } = useLatestVersion(data, featureGroups);

  const versions = useMemo(() => {
    const versions = featureGroups.filter(({ name }) => name === data?.name);
    return versions.map(
      ({ version }) =>
        `${version.toString()} ${
          version.toString() === latestVersion ? '(latest)' : ''
        }`,
    );
  }, [data, latestVersion, featureGroups]);

  const handleVersionChange = useCallback(
    (values) => {
      const newId = featureGroups.find(
        ({ version, name }) =>
          version === +values[0].split(' ')[0] && name === data?.name,
      )?.id;

      navigate(`/fg/${newId}`, routeNames.project.view);
    },
    [data, featureGroups, navigate],
  );

  return (
    <>
      <Panel
        type={ItemDrawerTypes.fg}
        data={data}
        title={String(data?.name)}
        id={data.id}
        hasVersionDropdown
        versionDropdown={
          <Select
            mb="-5px"
            width="143px"
            listWidth="100%"
            value={[
              `${data?.version.toString()} ${
                data?.version.toString() === latestVersion ? '(latest)' : ''
              }`,
            ]}
            options={versions}
            placeholder="version"
            onChange={handleVersionChange}
          />
        }
        idColor="labels.orange"
        onClickEdit={onClickEdit}
        onClickRefresh={onClickRefresh}
      />
      <Box mt="55px" width="100%">
        <SummaryData data={data} />
        <Anchor groupName="fgOverview" anchor={featureList}>
          <FeatureList data={data} />
        </Anchor>

        <Anchor groupName="fgOverview" anchor={provenance}>
          <Provenance data={data.provenance} />
        </Anchor>

        <Anchor groupName="fgOverview" anchor={schematisedTags}>
          <SchematisedTags data={data.tags} />
        </Anchor>

        <Anchor groupName="fgOverview" anchor={pipelineHistory}>
          <PipelineHistory data={data.jobs} />
        </Anchor>

        <Anchor groupName="fgOverview" anchor={runningCode}>
          <CodeCard
            title="Running Code"
            actions={action}
            content={runningCodes}
          />
        </Anchor>

        <Anchor anchor={api} groupName="fgOverview">
          <CodeCard
            mt="20px"
            mb="20px"
            title="API"
            actions={action}
            content={apiCode}
          />
        </Anchor>
      </Box>
    </>
  );
};

export default memo(OverviewContent);

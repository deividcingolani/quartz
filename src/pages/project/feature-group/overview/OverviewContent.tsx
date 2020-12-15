import { Box } from 'rebass';
import React, { FC, memo, useCallback, useMemo } from 'react';
import { Button, Select } from '@logicalclocks/quartz';

// Components
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
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { useLatestVersion } from '../../../../hooks/useLatestVersion';

export interface ContentProps {
  data: FeatureGroup;
  onClickRefresh: () => void;
  onClickEdit: () => void;
}

const action = (
  <Button p={0} intent="inline">
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

  const apiCode = useMemo(() => {
    return [
      {
        title: 'Python',
        code: `from hops import featurestore
featurestore.get_featuregroup('${data.name}')`,
      },
      {
        title: 'Scala',
        code: `import io.hops.util.Hops
Hops.getFeaturegroup("${data.name}").read()`,
      },
    ];
  }, [data]);

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
        title={String(data?.name)}
        id={data.id}
        hasVersionDropdown={true}
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
        idColor="label.orange"
        onClickEdit={onClickEdit}
        onClickRefresh={onClickRefresh}
      />
      <Box mt="40px" width="100%">
        <SummaryData data={data} />
        <Anchor groupName="overview" anchor={featureList}>
          <FeatureList data={data.features} />
        </Anchor>

        <Anchor groupName="overview" anchor={provenance}>
          <Provenance data={data.provenance} />
        </Anchor>

        <Anchor groupName="overview" anchor={schematisedTags}>
          <SchematisedTags data={data.tags} />
        </Anchor>

        <Anchor groupName="overview" anchor={pipelineHistory}>
          <PipelineHistory data={data.jobs} />
        </Anchor>

        <Anchor groupName="overview" anchor={runningCode}>
          <CodeCard
            title="Running Code"
            actions={action}
            content={runningCodes}
          />
        </Anchor>

        <Anchor anchor={api} groupName="overview">
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

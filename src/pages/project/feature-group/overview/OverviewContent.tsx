import { Box } from 'rebass';
import React, { FC, memo, useMemo } from 'react';
import { Button } from '@logicalclocks/quartz';

// Components
import Anchor from '../../../../components/anchor/Anchor';
import routeNames from '../../../../routes/routeNames';
import CodeCard from './CodeCard';
import Panel from './Panel';

// Types
import {
  FeatureGroup,
  FeatureGroupLabel,
} from '../../../../types/feature-group';
// Features
import FeatureList from './FeatureList';
import SummaryData from './SummaryData';
import PipelineHistory from './PipelineHistory';
import SchematisedTags from './SchematisedTags';

export interface ContentProps {
  data: FeatureGroup;
  isLabelsLoading: boolean;
  labels: FeatureGroupLabel[];
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
  schematisedTags,
  pipelineHistory,
  runningCode,
  api,
} = routeNames.featureGroup.overviewAnchors;

const OverviewContent: FC<ContentProps> = ({
  data,
  isLabelsLoading,
  onClickRefresh,
  onClickEdit,
  labels,
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

  return (
    <>
      <Panel
        title={String(data?.name)}
        id={data.id}
        onClickEdit={onClickEdit}
        onClickRefresh={onClickRefresh}
      />
      <Box mt="40px" width="100%">
        <SummaryData
          isLabelsLoading={isLabelsLoading}
          labels={labels}
          data={data}
        />
        <Anchor groupName="overview" anchor={featureList}>
          <FeatureList data={data.features} />
        </Anchor>

        <Anchor groupName="overview" anchor={schematisedTags}>
          <SchematisedTags />
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
          <CodeCard mt="30px" title="API" actions={action} content={apiCode} />
        </Anchor>
      </Box>
    </>
  );
};

export default memo(OverviewContent);

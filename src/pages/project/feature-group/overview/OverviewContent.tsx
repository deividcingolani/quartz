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
import SchematisedTags from './SchematisedTags';
import Provenance from './Provenance';
import FeatureList from './FeatureList';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import { selectFeatureStoreData } from '../../../../store/models/feature/selectors';
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
    href="https://docs.hopsworks.ai/latest/generated/api/feature_group_api/#get_feature_group"
    onClick={() =>
      window.open(
        'https://docs.hopsworks.ai/latest/generated/api/feature_group_api/#get_feature_group',
        '_blank',
      )
    }
  >
    API documentation ↗
  </Button>
);

const {
  featureList,
  provenance,
  schematisedTags,
  api,
} = routeNames.overviewAnchors;

const OverviewContent: FC<ContentProps> = ({
  data,
  onClickRefresh,
  onClickEdit,
}) => {
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

  const latestVersion = useMemo(
    () => Math.max(...(data?.versions?.map(({ version }) => version) || [])),
    [data],
  );

  const versions = useMemo(() => {
    return (
      data?.versions?.map(
        ({ version }) =>
          `${version} ${version === latestVersion ? '(latest)' : ''}`,
      ) || []
    );
  }, [data, latestVersion]);

  const handleVersionChange = useCallback(
    (values) => {
      const ver = values[0].includes(' ')
        ? +values[0].slice(0, values[0].indexOf(' '))
        : +values[0];

      const newId = data?.versions?.find(({ version }) => version === ver)?.id;

      if (newId) {
        navigate(`/fg/${newId}`, routeNames.project.view);
      }
    },
    [data, navigate],
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
                data?.version === latestVersion ? '(latest)' : ''
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

        <Anchor anchor={api} groupName="fgOverview">
          <CodeCard
            mt="20px"
            mb="40px"
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

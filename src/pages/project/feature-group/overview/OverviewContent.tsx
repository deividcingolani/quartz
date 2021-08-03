// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, useCallback, useMemo } from 'react';
import { Box } from 'rebass';
import { Button, Select } from '@logicalclocks/quartz';
// Hooks
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import useUserPermissions from './useUserPermissions';
// Components
import Anchor from '../../../../components/anchor/Anchor';
import routeNames from '../../../../routes/routeNames';
import CodeCard from './CodeCard';
import Panel from '../../../../components/panel/Panel';
// Types
import { FeatureGroup } from '../../../../types/feature-group';
import { RootState } from '../../../../store';
// Features
import SummaryData from './SummaryData';
import SchematisedTags from './SchematisedTags';
import Provenance from '../../../../components/provenance';
import FeatureList from './FeatureList';
import { ItemDrawerTypes } from '../../../../components/drawer/ItemDrawer';
import Expectations from './expectations/Expectations';
import CardBoundary from '../../../../components/error-boundary/CardBoundary';
// Selectors
import { selectFeatureStoreData } from '../../../../store/models/feature/selectors';

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

const { featureList, provenance, schematisedTags, api, expectations } =
  routeNames.overviewAnchors;

const OverviewContent: FC<ContentProps> = ({
  data,
  onClickRefresh,
  onClickEdit,
}) => {
  const { fsId } = useParams();

  const { data: featurestore } = useSelector((state: RootState) =>
    selectFeatureStoreData(state, +fsId),
  );

  const {
    canEdit,
    isOwnFs,
    isLoading: isPermissionsLoading,
  } = useUserPermissions();

  const apiCode = useMemo(() => {
    return [
      {
        title: 'Python',
        language: 'python',
        code: `import hsfs
connection = hsfs.connection()
fs = connection.get_feature_store(name='${featurestore?.featurestoreName}')
fg = fs.get_feature_group('${data.name}', version=${data.version})`,
      },
      {
        title: 'Scala',
        language: 'scala',
        code: `import com.logicalclocks.hsfs._ 
val connection = HopsworksConnection.builder().build();
val fs = connection.getFeatureStore("${featurestore?.featurestoreName}");
val fg = fs.getFeatureGroup("${data.name}", ${data.version})`,
      },
    ];
  }, [data, featurestore]);

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
        isEditDisabled={!canEdit || isPermissionsLoading}
        onClickEdit={onClickEdit}
        onClickRefresh={onClickRefresh}
      />
      <Box mt="55px" width="100%">
        <SummaryData data={data} canEdit={canEdit && !isPermissionsLoading} />
        <Anchor groupName="fgOverview" anchor={featureList}>
          <CardBoundary mt="20px" title="Feature list">
            <FeatureList data={data} />
          </CardBoundary>
        </Anchor>
        <Anchor groupName="fgOverview" anchor={provenance}>
          <CardBoundary mt="20px" title="Provenance">
            <Provenance provenance={data.provenance} rootId={data.id} />
          </CardBoundary>
        </Anchor>

        <Anchor groupName="fgOverview" anchor={expectations}>
          <Expectations
            data={data}
            isOwnFs={isOwnFs && !isPermissionsLoading}
          />
        </Anchor>

        <Anchor groupName="fgOverview" anchor={schematisedTags}>
          <CardBoundary mt="20px" title="Tags">
            <SchematisedTags data={data.tags} />
          </CardBoundary>
        </Anchor>

        <Anchor anchor={api} groupName="fgOverview">
          <CardBoundary mt="20px" title="API">
            <CodeCard
              mt="20px"
              mb="40px"
              title="API"
              actions={action}
              content={apiCode}
            />
          </CardBoundary>
        </Anchor>
      </Box>
    </>
  );
};

export default memo(OverviewContent);

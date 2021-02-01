import React, {
  ComponentType,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Drawer,
  Microlabeling,
  Row,
  Select,
  TextValueBadge,
  Value,
  Labeling,
} from '@logicalclocks/quartz';
import { Box, Flex } from 'rebass';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import useNavigateRelative from '../../hooks/useNavigateRelative';
import routeNames from '../../routes/routeNames';
import useJobRowData from '../../hooks/useJobRowData';
import Loader from '../loader/Loader';
import { DataEntity } from '../../types';
import { useLatestVersion } from '../../hooks/useLatestVersion';
import { selectFeatureStoreData } from '../../store/models/feature/selectors';
import { Dispatch, RootState } from '../../store';
import CommitGraph from './commit-graph';
import { FeatureGroup } from '../../types/feature-group';
import SchematisedTagTable from './SchematisedTagTable';

export enum ItemDrawerTypes {
  fg = 'fg',
  td = 'td',
}

export interface FeatureGroupDrawerProps<T extends DataEntity> {
  id: number;
  data: T[];
  handleToggle: () => void;
  navigateTo: (to: number) => string;
  type?: ItemDrawerTypes;
  isOpen: boolean;
  isSearch?: boolean;
  projectId?: number;
}

const ItemDrawer = <T extends DataEntity>({
  id,
  handleToggle,
  data,
  isOpen,
  navigateTo,
  isSearch,
  projectId,
  type = ItemDrawerTypes.fg,
}: FeatureGroupDrawerProps<T>) => {
  const navigate = useNavigateRelative();

  const handleNavigate = useCallback(
    (route: string) => (): void => {
      if (isSearch && projectId) {
        navigate(`/p/${projectId}${route}`);
      } else {
        navigate(route, routeNames.project.view);
      }
    },
    [navigate, isSearch, projectId],
  );

  const [jobComponents, jobProps] = useJobRowData([]);
  const [lastTrainingJobComponents, lastTrainingJobProps] = useJobRowData([]);

  const { data: featureStoreData } = useSelector(selectFeatureStoreData);

  const commits = useSelector(
    (state: RootState) => state.featureGroupCommitsDetail,
  );

  const tags = useSelector(
    (state: RootState) => state.featureGroupSchematisedTags,
  );

  const isCommitsLoading = useSelector(
    (state: RootState) => state.loading.effects.featureGroupCommitsDetail.fetch,
  );

  const isTagsLoading = useSelector(
    (state: RootState) =>
      state.loading.effects.featureGroupSchematisedTags.fetch,
  );

  const dispatch = useDispatch<Dispatch>();

  const [itemId, setId] = useState(id);

  const item = useMemo(() => data.find(({ id }) => id === itemId), [
    itemId,
    data,
  ]);

  useEffect(() => {
    const it = (item as unknown) as FeatureGroup;
    if (
      it?.timeTravelFormat === 'HUDI' &&
      featureStoreData?.projectId &&
      featureStoreData?.featurestoreId &&
      it?.id
    ) {
      dispatch.featureGroupCommitsDetail.fetch({
        projectId: featureStoreData.projectId,
        featureStoreId: featureStoreData.featurestoreId,
        featureGroupId: it.id,
        limit: 10,
      });
    }
    return () => {
      dispatch.featureGroupCommitsDetail.clear();
    };
  }, [dispatch, featureStoreData, item]);

  useEffect(() => {
    if (
      type === ItemDrawerTypes.fg &&
      featureStoreData?.featurestoreId &&
      item
    ) {
      dispatch.featureGroupSchematisedTags.fetch({
        projectId: featureStoreData.projectId,
        featureStoreId: featureStoreData.featurestoreId,
        featureGroupId: item.id,
      });
    }
    return () => {
      dispatch.featureGroupSchematisedTags.clear();
    };
  }, [dispatch, featureStoreData, item, type]);

  const handleVersionChange = useCallback(
    (values) => {
      const newId = data.find(
        ({ version, name }) =>
          version === +values[0].split(' ')[0] && name === item?.name,
      )?.id;
      if (newId) {
        setId(newId);
      }
    },
    [data, item],
  );

  const { latestVersion } = useLatestVersion<T>(item, data);

  const versions = useMemo(() => {
    const versions = data.filter(({ name }) => name === item?.name);
    return versions.map(
      ({ version }) =>
        `${version.toString()} ${
          version.toString() === latestVersion ? '(latest)' : ''
        }`,
    );
  }, [item, data, latestVersion]);

  if (!item) {
    return (
      <Drawer
        mt="10px"
        bottom="20px"
        closeOnBackdropClick={false}
        isOpen={isOpen}
        bottomButton={[
          `Open ${
            type === ItemDrawerTypes.fg
              ? "Feature Group's"
              : "Training Dataset's"
          } Page ->`,
          handleNavigate(navigateTo(itemId)),
        ]}
        onClose={handleToggle}
      >
        <Loader />
      </Drawer>
    );
  }

  return (
    <Drawer
      mt="10px"
      bottom="20px"
      isOpen={isOpen}
      headerSummary={
        <Box height="100%">
          <Flex height="100%">
            <TextValueBadge text="features" value={item.features.length} />
            <TextValueBadge ml="10px" text="rows" value="81M" />
            <TextValueBadge ml="10px" text="commits" value={32} />
            <TextValueBadge ml="10px" text="training datasets" value={32} />
          </Flex>
          <Box mt="30px">
            <Microlabeling gray>Location</Microlabeling>
            <Value sx={{ wordBreak: 'break-all' }} primary>
              {item.location}
            </Value>
          </Box>
        </Box>
      }
      bottomButton={[
        `Open ${
          type === ItemDrawerTypes.fg ? "Feature Group's" : "Training Dataset's"
        } Page ->`,
        handleNavigate(navigateTo(itemId)),
      ]}
      onClose={handleToggle}
    >
      <Box maxHeight="calc(100vh - 350px)" overflowY="auto">
        <Drawer.Section title="Activity" width="100%">
          {type === ItemDrawerTypes.fg && isCommitsLoading && (
            <Box width="100%" height="55px" sx={{ position: 'relative' }}>
              <Loader />
            </Box>
          )}
          {type === ItemDrawerTypes.fg &&
            !isCommitsLoading &&
            commits?.length > 0 && (
              <CommitGraph
                values={commits.map((commit) => ({
                  date: format(commit.committime, 'M/d/yyyy-HH:mm'),
                  added: commit.rowsInserted,
                  removed: commit.rowsDeleted,
                  modified: commit.rowsUpdated,
                }))}
                groupKey="date"
                keys={['added', 'removed', 'modified']}
              />
            )}
          {type === ItemDrawerTypes.fg &&
            !isCommitsLoading &&
            commits?.length === 0 && (
              <Labeling gray>No recent activity</Labeling>
            )}
        </Drawer.Section>
        <Drawer.Section title="Versions">
          <Select
            width="143px"
            listWidth="100%"
            value={[
              `${item.version.toString()} ${
                item.version.toString() === latestVersion ? '(latest)' : ''
              }`,
            ]}
            options={versions}
            placeholder="version"
            onChange={handleVersionChange}
          />
        </Drawer.Section>
        <Drawer.Section
          title="Last Ingestion Job"
          action={['view all injection jobs -->', () => ({})]}
        >
          <Row
            middleColumn={1}
            groupComponents={jobComponents as ComponentType<any>[][]}
            groupProps={jobProps}
          />
        </Drawer.Section>

        {type === ItemDrawerTypes.td ? (
          <Drawer.Section
            title="Last Training Job"
            action={['view all training jobs -->', () => ({})]}
          >
            <Row
              middleColumn={1}
              groupComponents={
                lastTrainingJobComponents as ComponentType<any>[][]
              }
              groupProps={lastTrainingJobProps}
            />
          </Drawer.Section>
        ) : null}

        <Drawer.Section title="Schematised Tags">
          {isTagsLoading && (
            <Box width="100%" height="55px" sx={{ position: 'relative' }}>
              <Loader />
            </Box>
          )}
          {!isTagsLoading &&
            (!!tags.length ? (
              <Flex width="100%" flexDirection="column">
                {tags.map((tag) => (
                  <SchematisedTagTable key={tag.name} tag={tag} />
                ))}
              </Flex>
            ) : (
              <Labeling gray>No schematised tags attached</Labeling>
            ))}
        </Drawer.Section>
      </Box>
    </Drawer>
  );
};

export default ItemDrawer;

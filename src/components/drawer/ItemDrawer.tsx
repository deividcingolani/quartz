import React, {
  ComponentType,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Badge,
  Drawer,
  Labeling,
  Microlabeling,
  Row,
  Select,
  TextValueBadge,
  Value,
} from '@logicalclocks/quartz';
import { Box, Flex } from 'rebass';
import { format, formatDistance } from 'date-fns';
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
import { ActivityItemData, FeatureGroup } from '../../types/feature-group';
import SchematisedTagTable from './SchematisedTagTable';

export enum ItemDrawerTypes {
  fg = 'fg',
  td = 'td',
}

const getVariant = (
  status?: string,
): 'light' | 'bold' | 'fail' | 'success' | 'label' => {
  const statusMap = new Map<
    string,
    'light' | 'bold' | 'fail' | 'success' | 'label'
  >([
    ['accepted', 'bold'],
    ['succeeded', 'success'],
    ['failed', 'fail'],
  ]);

  if (!status) {
    return 'bold';
  }

  return statusMap.get(status) || 'bold';
};

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

  const [lastJobs, setJobs] = useState<ActivityItemData[]>([]);

  const [lastTrainingJobComponents, lastTrainingJobProps] = useJobRowData([]);

  const { data: featureStoreData } = useSelector(selectFeatureStoreData);

  const { commits, tds } = useSelector(
    (state: RootState) => state.featureGroupCommitsDetail,
  );

  const tags = useSelector(
    (state: RootState) => state.featureGroupSchematisedTags,
  );

  const isCommitsLoading = useSelector(
    (state: RootState) =>
      state.loading.effects.featureGroupCommitsDetail.fetch ||
      state.loading.effects.featureGroupCommitsDetail.fetchTD,
  );

  const isTagsLoading = useSelector(
    (state: RootState) =>
      state.loading.effects.featureGroupSchematisedTags.fetch,
  );

  const isJobsLoading = useSelector(
    (state: RootState) => state.loading.effects.featureGroupView.fetchLastJobs,
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
      if (((item as unknown) as FeatureGroup).timeTravelFormat !== 'HUDI') {
        dispatch.featureGroupCommitsDetail.fetchTD({
          projectId: featureStoreData.projectId,
          featureStoreId: featureStoreData.featurestoreId,
          featureGroup: (item as unknown) as FeatureGroup,
        });
      }

      const loadJObs = async () => {
        const jobs = await dispatch.featureGroupView.fetchLastJobs({
          projectId: featureStoreData.projectId,
          featureStoreId: featureStoreData.featurestoreId,
          featureGroupId: item.id,
        });

        setJobs(jobs);
      };

      loadJObs();
    }
    return () => {
      dispatch.featureGroupSchematisedTags.clear();
    };
  }, [dispatch, featureStoreData, item, type]);

  const handleVersionChange = useCallback(
    (values) => {
      const newId = data?.find(
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
    const versions = data
      .filter(({ name }) => name === item?.name)
      .sort((itemA, itemB) => Math.sign(itemA.version - itemB.version));

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
          <Flex
            flexWrap="wrap"
            sx={{
              rowGap: '8px',
            }}
            height="100%"
          >
            <TextValueBadge text="features" value={item.features.length} />
            {type === ItemDrawerTypes.fg && (
              <>
                {isCommitsLoading ? (
                  <Labeling mx="8px" mt="3px" gray>
                    loading...
                  </Labeling>
                ) : (
                  <>
                    <TextValueBadge
                      ml="8px"
                      text="commits"
                      value={commits.length}
                    />
                    <TextValueBadge
                      ml="8px"
                      text="training dataset"
                      value={tds}
                    />
                  </>
                )}
              </>
            )}
            {type === ItemDrawerTypes.td && (
              <TextValueBadge
                ml="8px"
                text="splits"
                value={item.splits.length}
              />
            )}
            {type === ItemDrawerTypes.fg &&
              !!((item as unknown) as FeatureGroup).timeTravelFormat && (
                <TextValueBadge
                  text="time travel"
                  value={((item as unknown) as FeatureGroup).timeTravelFormat.toLowerCase()}
                />
              )}
          </Flex>
          {type === ItemDrawerTypes.fg && (
            <Box mt="30px">
              <Microlabeling gray>Location</Microlabeling>
              <Value sx={{ wordBreak: 'break-all' }} primary>
                {item.location}
              </Value>
            </Box>
          )}
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
        {type === ItemDrawerTypes.fg ? (
          <Drawer.Section title="Activity" width="100%">
            {isCommitsLoading && (
              <Box width="100%" height="55px" sx={{ position: 'relative' }}>
                <Loader />
              </Box>
            )}
            {!isCommitsLoading && commits?.length > 0 && (
              <CommitGraph
                values={commits.map((commit) => ({
                  date: format(commit.commitTime, 'M/d/yyyy-HH:mm'),
                  added: commit.rowsInserted,
                  deleted: commit.rowsDeleted,
                  modified: commit.rowsUpdated,
                }))}
                groupKey="date"
                keys={['added', 'deleted', 'modified']}
              />
            )}
            {!isCommitsLoading && commits?.length === 0 && (
              <Labeling gray>No recent activity</Labeling>
            )}
          </Drawer.Section>
        ) : null}
        {type === ItemDrawerTypes.td ? (
          <Drawer.Section title="Activity" width="100%">
            {isCommitsLoading && (
              <Box width="100%" height="55px" sx={{ position: 'relative' }}>
                <Loader />
              </Box>
            )}
            {!isCommitsLoading && commits?.length > 0 && (
              <CommitGraph
                values={commits.map((commit) => ({
                  date: format(commit.commitTime, 'M/d/yyyy-HH:mm'),
                  added: commit.rowsInserted,
                  deleted: commit.rowsDeleted,
                  modified: commit.rowsUpdated,
                }))}
                groupKey="date"
                keys={['added', 'deleted', 'modified']}
              />
            )}
            {!isCommitsLoading && commits?.length === 0 && (
              <Labeling gray>No activity</Labeling>
            )}
          </Drawer.Section>
        ) : null}
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
        {type === ItemDrawerTypes.fg && (
          <Drawer.Section
            title="Last Ingestion Job"
            action={[
              'view all jobs -->',
              () => navigate(`/p/${projectId}/fg/${item.id}/activity/JOB`),
            ]}
          >
            {isJobsLoading && (
              <Box width="100%" height="55px" sx={{ position: 'relative' }}>
                <Loader />
              </Box>
            )}
            {!isJobsLoading &&
              (!!lastJobs.length && !!lastJobs[0].job ? (
                <Flex
                  alignItems="center"
                  px="10px"
                  py="20px"
                  width="100%"
                  sx={{
                    borderStyle: 'solid',
                    borderWidth: '1px',
                    borderColor: 'grayShade2',
                  }}
                  justifyContent="space-between"
                >
                  <Flex alignItems="center">
                    <Box minWidth="auto">
                      <Badge
                        mr="20px"
                        variant={getVariant(
                          lastJobs[0].job.executions?.finalStatus?.toLowerCase(),
                        )}
                        value={lastJobs[0].job.executions?.finalStatus?.toLowerCase()}
                      />
                    </Box>
                    <Box
                      sx={{
                        div: {
                          wordBreak: 'break-all',
                        },
                      }}
                    >
                      <Value>{lastJobs[0].job.config?.appName}</Value>
                    </Box>
                  </Flex>
                  <Box ml="20px" minWidth="fit-content">
                    <Value primary>
                      {formatDistance(lastJobs[0].timestamp, new Date())} ago
                    </Value>
                  </Box>
                </Flex>
              ) : (
                <Labeling gray>No last job</Labeling>
              ))}
          </Drawer.Section>
        )}

        {type === ItemDrawerTypes.td ? (
          <Drawer.Section
            title="Last Training Job"
            action={['view all training jobs -->', () => ({})]}
          >
            {isJobsLoading && (
              <Box width="100%" height="55px" sx={{ position: 'relative' }}>
                <Loader />
              </Box>
            )}
            {!isJobsLoading &&
              (!!lastJobs.length && !!lastJobs[0].job ? (
                <Row
                  middleColumn={1}
                  groupComponents={
                    lastTrainingJobComponents as ComponentType<any>[][]
                  }
                  groupProps={lastTrainingJobProps}
                />
              ) : (
                <Labeling gray>No ingestion</Labeling>
              ))}
          </Drawer.Section>
        ) : null}

        <Drawer.Section title="Tags">
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
              <Labeling gray>No tag schemas attached</Labeling>
            ))}
        </Drawer.Section>
      </Box>
    </Drawer>
  );
};

export default ItemDrawer;

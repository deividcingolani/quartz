// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useMemo } from 'react';
import { Flex } from 'rebass';
import {
  Card,
  Value,
  Button,
  Labeling,
  CalloutTypes,
  Callout,
} from '@logicalclocks/quartz';
// Hooks
import { useDispatch, useSelector } from 'react-redux';
import { ShareReply } from '../../../../services/project/MultiStoreService';
// Types
import { getDatasetProject, shareableServicesToLabelMap } from './utils';
import { Dispatch, RootState } from '../../../../store';
import { Project } from '../../../../types/project';
import { ShareableSevices } from '../../../../types/multistore';
// Components
import AccessRightsTable, { AccessRightsTableTypes } from './AccessRightsTable';
import { SharedDataset } from '../../../../store/models/projects/multistore.model';

export interface SharedFromProps {
  project: Project;
  datasets: SharedDataset[];
  userIsLimited: boolean;
}

const SharedFrom: FC<SharedFromProps> = ({
  datasets,
  project,
  userIsLimited,
}) => {
  const dispatch = useDispatch<Dispatch>();

  const isReplying = useSelector(
    (state: RootState) =>
      state.loading.effects.multistore.acceptShare ||
      state.loading.effects.multistore.rejectShare,
  );

  const pendingDatasets = useMemo(() => {
    return datasets.filter((ds) => !ds.accepted);
  }, [datasets]);

  const acceptedDatasets = useMemo(() => {
    return datasets.filter((ds) => ds.accepted);
  }, [datasets]);

  const entitiesByProject = useMemo(() => {
    return acceptedDatasets.reduce((acc, ds) => {
      const project = getDatasetProject(ds.name);
      acc[project] = [...(acc[project] || []), ds];
      return acc;
    }, {} as any);
  }, [acceptedDatasets]);

  const handleShareReply = useCallback(
    async (ds, action) => {
      if (project.projectId && project.projectName) {
        const targetName = getDatasetProject(ds.name);
        await dispatch.multistore.replyShare({
          id: project.projectId,
          name: targetName,
          action,
          service: ShareableSevices.FEATURESTORE,
        });
        await dispatch.multistore.getSharedFrom({ id: project.projectId });
        if (action === ShareReply.accept) {
          await dispatch.featureStores.fetch({ projectId: project.projectId });
        }
      }
    },
    [
      project.projectId,
      project.projectName,
      dispatch.multistore,
      dispatch.featureStores,
    ],
  );

  return (
    <Card mt="20px" title="Shared from other projects">
      {userIsLimited && pendingDatasets.length ? (
        <Flex mb="20px">
          <Callout
            content={
              <Flex alignItems="center">
                <Value>
                  {`${pendingDatasets.length} entit${
                    pendingDatasets.length > 1 ? `ies are` : `y is`
                  } pending to be shared with this project. You have to be Data Owner to accept ${
                    pendingDatasets.length > 1 ? 'them' : 'it'
                  }.`}
                </Value>
              </Flex>
            }
            type={CalloutTypes.neutral}
          />
        </Flex>
      ) : null}
      {!userIsLimited &&
        pendingDatasets.map((ds) => (
          <Flex
            flexDirection="column"
            key={ds.id}
            p="8px"
            mb="20px"
            bg="grayShade3"
            sx={{ border: '1px solid', borderColor: 'grayShade2' }}
          >
            <Flex
              flexDirection="row"
              justifyContent="space-between"
              alignItems="baseline"
            >
              <>
                <Flex pl="8px">
                  <Value>{`${ds.sharedBy.firstname} requested to share`}</Value>
                  &nbsp;
                  <Value color="labels.green">
                    {(shareableServicesToLabelMap as any)[ds.datasetType]}
                  </Value>
                  &nbsp;
                  <Value>from</Value>
                  &nbsp;
                  <Value color="labels.green">
                    {getDatasetProject(ds.name)}
                  </Value>
                  &nbsp;
                  <Value>with this project</Value>
                </Flex>
                <Flex flexDirection="row">
                  <Button
                    intent="secondary"
                    mr="8px"
                    onClick={() => handleShareReply(ds, ShareReply.accept)}
                    disabled={isReplying}
                  >
                    Accept
                  </Button>
                  <Button
                    intent="alert"
                    onClick={() => handleShareReply(ds, ShareReply.reject)}
                    disabled={isReplying}
                  >
                    Reject
                  </Button>
                </Flex>
              </>
            </Flex>
          </Flex>
        ))}
      {acceptedDatasets.length > 0 ? (
        <Flex mb="20px">
          <Value>This project uses</Value>
          &nbsp;
          <Value color="labels.green">
            {`${acceptedDatasets.length} entit${
              acceptedDatasets.length > 1 ? 'ies' : 'y'
            }`}
          </Value>
          &nbsp;
          <Value>from other projects</Value>
        </Flex>
      ) : (
        <>
          <Labeling gray>
            This project does not share any entity from other projects
          </Labeling>
        </>
      )}
      <Flex flexDirection="row" flexWrap="wrap">
        {Object.keys(entitiesByProject).map((projectName, idx) => (
          <Flex
            key={projectName}
            mr={(idx + 1) % 3 === 0 ? '0px' : '20px'}
            width="calc(33.3333333% - (1/3*40px))"
            mb="20px"
          >
            <AccessRightsTable
              mainText={
                <Value sx={{ color: 'labels.green' }}>{projectName}</Value>
              }
              shared={(entitiesByProject as any)[projectName]}
              type={AccessRightsTableTypes.FROM}
            />
          </Flex>
        ))}
      </Flex>
    </Card>
  );
};

export default SharedFrom;

// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC } from 'react';
import { Flex } from 'rebass';
import {
  Card,
  Value,
  Button,
  usePopup,
  Text,
  Labeling,
  Tooltip,
} from '@logicalclocks/quartz';
// Types
import { useSelector } from 'react-redux';
import { SharedProject } from '../../../../types/multistore';
import { Project } from '../../../../types/project';
import { RootState } from '../../../../store';
// Components
import AccessRightsTable from './AccessRightsTable';
import SharePopup from './popups/SharePopup';
import EditRightsPopup from './popups/EditRightsPopup';

export interface SharedWithProps {
  project: Project;
  shared: SharedProject[];
  userIsLimited: boolean;
}

const SharedWith: FC<SharedWithProps> = ({
  shared,
  project,
  userIsLimited,
}) => {
  const [isEditPermissionsOpen, handleToggleEditPermissions] = usePopup(false);
  const [isShareFSOpen, handleToggleShareFS] = usePopup(false);

  const projects = useSelector((state: RootState) => state.projectsList);

  return (
    <>
      <Card mt="20px" title="Shared with other projects">
        {shared.length > 0 ? (
          <>
            <Flex flexDirection="row" justifyContent="space-between">
              <Flex flexDirection="row">
                <Value>This project shares</Value>
                &nbsp;
                <Value color="labels.green">1 entity</Value>
                &nbsp;
                <Value>with</Value>
                &nbsp;
                <Value color="labels.green">
                  {`${shared.length} other projects`}
                </Value>
              </Flex>
              <Tooltip
                mainText={
                  userIsLimited
                    ? 'You have no rights to share the feature store'
                    : 'Share feature store with other projects'
                }
              >
                <Button disabled={userIsLimited} onClick={handleToggleShareFS}>
                  Share feature store
                </Button>
              </Tooltip>
            </Flex>
            <Flex width={1 / 3}>
              <AccessRightsTable
                mainText={
                  <Value sx={{ color: 'labels.green' }}>Feature Store</Value>
                }
                secondaryText={
                  <Tooltip
                    mainText={
                      userIsLimited
                        ? 'You have no permission to edit the access rights'
                        : 'Edit access rights for shared feature store'
                    }
                  >
                    <Button
                      intent="inline"
                      p="0px"
                      onClick={handleToggleEditPermissions}
                      disabled={userIsLimited}
                    >
                      edit access rights
                    </Button>
                  </Tooltip>
                }
                shared={shared}
              />
            </Flex>
          </>
        ) : (
          <>
            <Labeling mb="20px" gray>
              This project does not share any entity with another project
            </Labeling>
            <Flex justifyContent="space-between">
              <Text>
                Sharing the feature store with another project allows its users
                to access to its data and perform new actions like creating a
                training dataset with features from multiple feature stores.
              </Text>
              <Flex>
                <Tooltip
                  mainText={
                    userIsLimited
                      ? 'You have no rights to share the feature store'
                      : 'Share feature store with other projects'
                  }
                >
                  <Button
                    ml="20px"
                    minWidth="146px"
                    disabled={userIsLimited}
                    onClick={handleToggleShareFS}
                  >
                    Share feature store
                  </Button>
                </Tooltip>
              </Flex>
            </Flex>
          </>
        )}
      </Card>
      {/* POPUPS */}
      {/* EDIT PERMISSIONS */}
      {isEditPermissionsOpen && (
        <EditRightsPopup
          project={project}
          shared={shared}
          handleToggle={handleToggleEditPermissions}
        />
      )}

      {/* SHARE FEATURE STORE */}
      {isShareFSOpen && (
        <SharePopup
          project={project}
          shared={shared}
          projects={projects}
          handleToggle={handleToggleShareFS}
        />
      )}
    </>
  );
};

export default SharedWith;

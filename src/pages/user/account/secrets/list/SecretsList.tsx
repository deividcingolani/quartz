// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { ComponentType, FC, memo, useEffect, useState } from 'react';
import { Box, Flex } from 'rebass';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Card,
  Code,
  Labeling,
  Row as QRow,
  TinyPopup,
  usePopup,
  Value,
} from '@logicalclocks/quartz';

// Selectors
import {
  selectSecrets,
  selectSecretsListLoading,
} from '../../../../../store/models/secrets/secrets.selectors';
import { projectsList } from '../../../../../store/models/projects/selectors';
// Components
import Loader from '../../../../../components/loader/Loader';
// Styles
import secretsListStyles from './SecretsListStyles';
// Types
import { Dispatch } from '../../../../../store';
// Hooks
import useSecretsListRowsData from './useSecretsListRowsData';
import useTitle from '../../../../../hooks/useTitle';
import titles from '../../../../../sources/titles';
import routeNames from '../../../../../routes/routeNames';

const Row = memo(QRow);

const SecretsList: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch>();
  const [touchedSecret, setTouchedSecret] = useState<{
    name: string;
    secret: string;
  }>();

  const [isDeletePopupOpen, handleToggleDelete] = usePopup();
  const [isReadPopupOpen, handleToggleRead] = usePopup();

  const isSecretsLoading = useSelector(selectSecretsListLoading);
  const secrets = useSelector(selectSecrets).sort((keyA, keyB) =>
    keyA.name.localeCompare(keyB.name),
  );

  useTitle(titles.secrets);

  const { projects, isLoading: isProjectsLoading } = useSelector(projectsList);

  const handleOpenRead = (selection: { name: string; secret: string }) => {
    setTouchedSecret(selection);
    handleToggleRead();
  };

  const handleOpenDelete = (selection: { name: string; secret: string }) => {
    setTouchedSecret(selection);
    handleToggleDelete();
  };

  const handleDelete = async () => {
    if (touchedSecret) {
      await dispatch.secrets.delete(touchedSecret.name);
      dispatch.secrets.fetchAll();
      handleToggleDelete();
    }
  };

  const [groupComponents, groupProps] = useSecretsListRowsData(
    secrets,
    projects,
    handleOpenRead,
    handleOpenDelete,
  );

  useEffect(() => {
    dispatch.secrets.fetchAll();
    dispatch.projectsList.getProjects();
  }, [dispatch]);

  if (isSecretsLoading || isProjectsLoading) {
    return <Loader />;
  }

  if (!secrets.length) {
    return (
      <Card
        title="Secrets"
        actions={
          <Button
            onClick={() =>
              window.open(
                'https://hopsworks.readthedocs.io/en/stable/user_guide/hopsworks/jupyter.html?highlight=secrets#storing-api-key-to-hopsworks',
                '_blank',
              )
            }
            p={0}
            intent="inline"
          >
            documentation↗
          </Button>
        }
      >
        <Box mt="20px" mx="-20px">
          <Flex
            height="140px"
            mt="30px"
            flexDirection="column"
            alignItems="center"
          >
            <Labeling fontSize="18px" bold>
              No secrets defined
            </Labeling>
            <Labeling mt="15px">
              Secrets let you store sensitive data in order to access to it
              later from a Jupyter notebook for instance
            </Labeling>
            <Button
              mt="40px"
              minWidth="105px"
              onClick={() => navigate(routeNames.account.secrets.create)}
            >
              New Secret
            </Button>
          </Flex>
        </Box>
      </Card>
    );
  }

  return (
    <>
      <Card
        width="1000px"
        title="Secrets"
        contentProps={{ pb: 0, overflow: 'visible' }}
        actions={
          <Button
            onClick={() =>
              window.open(
                'https://hopsworks.readthedocs.io/en/stable/user_guide/hopsworks/jupyter.html?highlight=secrets#storing-api-key-to-hopsworks',
                '_blank',
              )
            }
            p={0}
            intent="inline"
          >
            documentation↗
          </Button>
        }
      >
        <Flex mb="25x">
          <Flex width="100%">
            <Value primary>{secrets.length}</Value>
            <Value ml="5px">
              {secrets.length > 1 ? ' Secrets' : ' Secret'}
            </Value>
          </Flex>
          <Button
            minWidth="105px"
            onClick={() => navigate(routeNames.account.secrets.create)}
          >
            New Secret
          </Button>
        </Flex>
        <Box mt="20px" mx="-20px" sx={secretsListStyles}>
          <Row
            legend={['name', 'visibility', 'creation']}
            middleColumn={2}
            groupComponents={groupComponents as ComponentType<any>[][]}
            groupProps={groupProps}
          />
        </Box>
      </Card>
      <TinyPopup
        width="440px"
        title="Read the secret"
        isOpen={isReadPopupOpen}
        onClose={handleToggleRead}
        secondaryText=""
        secondaryButton={['Done', handleToggleRead]}
      >
        <Box m="-20px" mb="0px">
          <Code
            copyButton
            content={touchedSecret?.secret || ''}
            title={touchedSecret?.name}
          />
        </Box>
      </TinyPopup>
      <TinyPopup
        width="440px"
        isOpen={isDeletePopupOpen}
        onClose={handleToggleDelete}
        title={`Delete secret ${touchedSecret?.name}`}
        secondaryButton={['Back', handleToggleDelete]}
        mainButton={['Delete Secret', handleDelete]}
        secondaryText="Once you delete a secret, there is no going back. Please be certain."
      />
    </>
  );
};

export default SecretsList;

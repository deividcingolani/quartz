// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useState, useEffect, useCallback } from 'react';
import {
  Card,
  Value,
  Input,
  Button,
  Select,
  Labeling,
  usePopup,
  TinyPopup,
  NotificationsManager,
} from '@logicalclocks/quartz';
import * as yup from 'yup';
import { Box, Flex } from 'rebass';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';

// Utils
import { shortRequiredText } from '../../../utils/validators';
import getInputValidation from '../../../utils/getInputValidation';
// Types
import { Dispatch, RootState } from '../../../store';
import { Databricks } from '../../../types/databricks';
// Selectors
import {
  selectDatabricks,
  selectDatabricksLoading,
} from '../../../store/models/databricks/databricks.selectors';
// Components
import ClusterRow from './ClusterRow';
import Loader from '../../../components/loader/Loader';
import NotificationTitle from '../../../utils/notifications/notificationBadge';
import NotificationContent from '../../../utils/notifications/notificationValue';

import useTitle from '../../../hooks/useTitle';
import titles from '../../../sources/titles';

export const schema = yup.object().shape({
  name: shortRequiredText.label('Instance name'),
  key: shortRequiredText.label('API key'),
});

const ProjectDatabricks: FC = () => {
  const { id } = useParams();

  useTitle(titles.databricks);

  const dispatch = useDispatch<Dispatch>();

  const [isPopupOpen, handleToggle] = usePopup();

  const { errors, register, handleSubmit, setValue } = useForm({
    shouldUnregister: false,
    resolver: yupResolver(schema),
  });

  const databricks = useSelector(selectDatabricks);
  const project = useSelector((state: RootState) => state.project);

  const isLoading = useSelector(selectDatabricksLoading);

  const [selected, setSelected] = useState<Databricks>();

  useEffect(() => {
    if (!selected) {
      setSelected(databricks[0]);
    }
  }, [databricks, selected]);

  const onChange = useCallback(
    (value) => {
      const databrick = databricks.find(({ url }) => url === value[0]);
      if (databrick) {
        setSelected(databrick);
      }
    },
    [databricks],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSubmit = useCallback(
    handleSubmit(async ({ name, key }) => {
      await dispatch.databricks
        .create({
          data: {
            projectId: +id,
            data: {
              name,
              apiKey: key,
            },
          },
        })
        .then(() => {
          NotificationsManager.create({
            isError: false,
            type: <NotificationTitle message="Instance added" />,
            content: <NotificationContent message={`${name} has been added`} />,
          });

          dispatch.databricks.fetch({
            projectId: +id,
          });
        })
        .catch(() => {
          NotificationsManager.create({
            type: <NotificationTitle message="Fail" />,
            content: (
              <NotificationContent message={`${name} was not created`} />
            ),
          });
        });

      handleToggle();

      setValue('name', '');
      setValue('key', '');
    }),
    [dispatch, id, handleToggle, setValue],
  );

  useEffect(() => {
    dispatch.project.getProject(+id);
    dispatch.databricks.fetch({
      projectId: +id,
    });
  }, [dispatch, id]);

  if (isLoading || !project.projectTeam?.length) {
    return <Loader />;
  }

  return (
    <>
      <Card
        mb="40px"
        title="Configure Databricks integration"
        actions={
          <Button
            onClick={() =>
              window.open(
                'https://docs.hopsworks.ai/generated/project/#connection',
                '_blank',
              )
            }
            p={0}
            intent="inline"
          >
            documentation↗
          </Button>
        }
        contentProps={{
          pb: 0,
          overflow: 'visible',
        }}
      >
        {!databricks.length && (
          <Flex flexDirection="column" mb="30px" mt="20px" alignItems="center">
            <Labeling bold gray fontSize="18px">
              No instance defined
            </Labeling>
            <Button onClick={handleToggle} mt="20px" width="fit-content">
              Add a new instance
            </Button>
          </Flex>
        )}

        {!!databricks.length && !!selected && (
          <>
            <Flex justifyContent="space-between">
              <Flex>
                <Select
                  width="auto"
                  listWidth="100%"
                  onChange={onChange}
                  value={[selected.url]}
                  placeholder="instance"
                  options={databricks.map(({ url }) => url)}
                />
                <Flex alignItems="center" ml="10px">
                  <Value primary>{selected.clusters.length}</Value>
                  <Labeling ml="5px" gray mr="5px">
                    clusters configured for
                  </Labeling>
                  <Value primary>{selected.url}</Value>
                </Flex>
              </Flex>
              <Button onClick={handleToggle}>Add a new instance</Button>
            </Flex>

            {!selected && (
              <Flex
                mt="20px"
                py="50px"
                mx="-20px"
                alignItems="center"
                flexDirection="column"
                sx={{
                  borderTop: '1px solid #E2E2E2',
                }}
              >
                <Labeling bold gray fontSize="18px">
                  This instance do not have any cluster
                </Labeling>
              </Flex>
            )}

            {!!selected && (
              <Box mx="-20px">
                <Box mt="20px" as="table" width="100%">
                  <Box as="tbody">
                    {selected.clusters.map((cluster) => (
                      <ClusterRow
                        cluster={cluster}
                        key={cluster.name}
                        databricks={selected}
                        members={project.projectTeam}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            )}
          </>
        )}
      </Card>

      <TinyPopup
        secondaryText=""
        isOpen={isPopupOpen}
        onClose={handleToggle}
        secondaryButton={['Cancel', handleToggle]}
        mainButton={['Add new instance', onSubmit]}
        title="Configure a new Databricks instance"
      >
        <Box mb="20px">
          <Input
            name="name"
            width="100%"
            ref={register}
            label="Instance name"
            {...getInputValidation('name', errors)}
            placeholder="abc-abcd1234-ab12.cloud.databricks.com"
          />
          <Input
            name="key"
            width="100%"
            labelProps={{
              mt: '20px',
            }}
            ref={register}
            label="API key"
            {...getInputValidation('key', errors)}
            placeholder="abc123def456ghi789jkl123mno456pqr789"
          />
        </Box>
      </TinyPopup>
    </>
  );
};

export default ProjectDatabricks;

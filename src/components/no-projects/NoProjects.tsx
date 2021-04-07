import { Box, Flex } from 'rebass';
import React, { FC, useCallback } from 'react';
import { Button, Value } from '@logicalclocks/quartz';
import { useDispatch } from 'react-redux';

// Types
import { Dispatch } from '../../store';

// Hooks
import useNavigateRelative from '../../hooks/useNavigateRelative';

import routeNames from '../../routes/routeNames';

import hopsworksIcon from './hopsworks-62x62';

const NoData: FC = () => {
  const navigate = useNavigateRelative();
  const dispatch = useDispatch<Dispatch>();

  // Handlers
  const handleCreate = useCallback(() => {
    navigate(routeNames.project.create);
  }, [navigate]);

  const handleSubmitDemo = useCallback(async () => {
    const project = await dispatch.project.create({
      data: {
        retentionPeriod: '',
        services: [],
        type: 'fs',
        projectName: 'demo_starterProject',
        description: 'demo project',
      },
    });

    if (project) {
      navigate(`/p/${project.id}/view`);
    }
  }, [dispatch, navigate]);
  return (
    <Flex flexDirection="column" alignItems="center" my="auto">
      <Box mb="30px">{hopsworksIcon}</Box>
      <Value fontFamily="Inter" fontSize="22px" mb="30px">
        Welcome to Hopsworks
      </Value>
      <Value>Get started by creating a new project.</Value>
      <Flex alignItems="center">
        <Value>Find more information in the</Value>
        <Button
          px="3px"
          py={0}
          onClick={() =>
            window.open('https://docs.hopsworks.ai/latest/', '_blank')
          }
          intent="inline"
        >
          documentation↗
        </Button>
        <Value>or support in our </Value>
        <Button
          px="3px"
          py={0}
          onClick={() =>
            window.open('https://community.hopsworks.ai/', '_blank')
          }
          intent="inline"
        >
          community↗
        </Button>
      </Flex>
      <Flex mt="30px">
        <Button onClick={handleSubmitDemo} mr="14px" intent="secondary">
          Run a demo project
        </Button>
        <Button onClick={handleCreate}>Create new project</Button>
      </Flex>
    </Flex>
  );
};

export default NoData;

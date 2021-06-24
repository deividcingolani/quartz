// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback } from 'react';
import { Box, Flex } from 'rebass';
import { useNavigate, useParams } from 'react-router-dom';
import { Text } from '@logicalclocks/quartz';

const DeepSearchButtons: FC<{ search: string; activeIndex: number }> = ({
  search,
  activeIndex,
}) => {
  const navigate = useNavigate();
  const { id: projectId } = useParams();

  const handleNavigate = useCallback(
    (isAllProjects = false) =>
      () => {
        if (!isAllProjects && projectId) {
          navigate(`/search/p/${projectId}/features/${search}`);
        } else {
          navigate(`/search/features/${search}`);
        }
      },
    [navigate, projectId, search],
  );

  return (
    <Box mt="1px" bg="white" width="474px" py="8px">
      <Flex
        sx={{
          cursor: 'pointer',
          ':hover': {
            bg: 'grayShade2',
          },
        }}
        px="12px"
        height="30px"
        alignItems="center"
        onClick={handleNavigate(true)}
        bg={activeIndex === 0 ? 'grayShade2' : 'white'}
      >
        <Text>Advanced search across all projects</Text>
      </Flex>
      <Flex
        sx={{
          cursor: 'pointer',
          ':hover': {
            bg: 'grayShade2',
          },
        }}
        px="12px"
        height="30px"
        alignItems="center"
        onClick={handleNavigate()}
        bg={activeIndex === 1 ? 'grayShade2' : 'white'}
      >
        <Text>Advanced search in the current project</Text>
      </Flex>
    </Box>
  );
};

export default DeepSearchButtons;

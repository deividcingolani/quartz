import { Box, Flex } from 'rebass';
import { useNavigate, useParams } from 'react-router-dom';
import { Text } from '@logicalclocks/quartz';
import React, { FC, useCallback } from 'react';

const DeepSearchButtons: FC<{ search: string; activeIndex: number }> = ({
  search,
  activeIndex,
}) => {
  const navigate = useNavigate();
  const { id: projectId } = useParams();

  const handleNavigate = useCallback(
    (isAllProjects = false) => () => {
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
            bg: 'grayShade3',
          },
        }}
        bg={activeIndex === 0 ? 'grayShade3' : 'white'}
        onClick={handleNavigate(true)}
        px="12px"
        height="30px"
        alignItems="center"
      >
        <Text>Advanced search across all project</Text>
      </Flex>
      <Flex
        sx={{
          cursor: 'pointer',
          ':hover': {
            bg: 'grayShade3',
          },
        }}
        bg={activeIndex === 1 ? 'grayShade3' : 'white'}
        onClick={handleNavigate()}
        px="12px"
        height="30px"
        alignItems="center"
      >
        <Text>Advanced search in the current project</Text>
      </Flex>
    </Box>
  );
};

export default DeepSearchButtons;

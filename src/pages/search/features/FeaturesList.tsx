import { Box, Flex } from 'rebass';
import {
  Badge,
  IconButton,
  Labeling,
  Value,
  ProjectBadge,
} from '@logicalclocks/quartz';
import { useSelector } from 'react-redux';
import React, { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';

// Types
import { RootState } from '../../../store';
import { Feature } from '../../../types/feature-group';
// Hooks
import useDrawer from '../../../hooks/useDrawer';
// Components
import FeatureDrawer from '../../../components/feature-drawer/FeatureDrawer';
import styles from '../../project/styles/hoverable-card';
import NoSearchData from '../NoSearchData';

export interface FeaturesListProps {
  data: Feature[];
}

const FeaturesList: FC<FeaturesListProps> = ({ data }) => {
  const { id: projectId } = useParams();

  const { isOpen, selectedId, handleSelectItem, handleClose } = useDrawer();

  const projectsIds = useSelector((state: RootState) => state.projectsList).map(
    ({ id }) => id,
  );

  const selectedItem = useMemo(() => {
    return data.find(({ featureId }) => featureId === selectedId);
  }, [data, selectedId]);

  if (!data.length) {
    return <NoSearchData subject="features" />;
  }

  return (
    <Flex
      height="calc(100vh - 175px)"
      width="100%"
      margin="0 auto"
      maxWidth="1200px"
      flexDirection="column"
    >
      <Flex mb="20px">
        <Value primary>{data.length}</Value>
        <Value ml="5px">features match</Value>
      </Flex>

      {!!selectedId && !!selectedItem && (
        <FeatureDrawer
          isOpen={isOpen}
          handleToggle={handleClose}
          feature={selectedItem}
        />
      )}
      <Flex p="5px" flexDirection="column">
        {data.map(
          ({
            id,
            featureId,
            name,
            featuregroup,
            version,
            parentProjectName = '',
            parentProjectId,
            matchText,
          }) => (
            <Box
              key={`${featureId}`}
              onClick={handleSelectItem(featureId)}
              sx={styles(selectedId === featureId)}
            >
              <Flex
                px="20px"
                bg="white"
                height="60px"
                alignItems="center"
                justifyContent="space-between"
              >
                <Flex>
                  <Value lineHeight="60px" fontSize="18px">
                    {name}
                  </Value>
                  <Flex mt="25px">
                    <Labeling ml="20px" gray>
                      from
                    </Labeling>
                    <Value ml="5px">{featuregroup}</Value>
                    <Value ml="5px" sx={{ color: 'labels.orange' }}>
                      #{id}
                    </Value>
                    <Value ml="5px">version {version}</Value>

                    {!projectId && (
                      <ProjectBadge
                        ml="10px"
                        mt="-5px"
                        height="fit-content"
                        value={parentProjectName}
                        isLock={!projectsIds.includes(parentProjectId)}
                      />
                    )}
                  </Flex>
                </Flex>

                <Flex alignItems="center">
                  <Badge mr="20px" height="fit-content" value={matchText} />
                  <Box
                    sx={{
                      button: {
                        border: 'none',
                      },
                      svg: {
                        fontSize: '12px !important',
                      },
                    }}
                  >
                    <IconButton tooltip="Open drawer" icon={['far', 'eye']} />
                  </Box>
                </Flex>
              </Flex>
            </Box>
          ),
        )}
      </Flex>
    </Flex>
  );
};

export default FeaturesList;

import React, { FC, memo, useCallback } from 'react';
import {
  Value,
  Button,
  Subtitle,
  Labeling,
  IconButton,
  FreshnessBar,
  Microlabeling,
  Card as QuartzCard,
  User,
  Dot,
} from '@logicalclocks/quartz';
import formatDistance from 'date-fns/formatDistance';
import { Flex, CardProps as RebassCardProps, Box } from 'rebass';

// eslint-disable-next-line import/no-unresolved
import { TooltipProps } from '@logicalclocks/quartz/dist/components/tooltip';

import ProfileService from '../../../../services/ProfileService';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import CardLabels from './CardLabels';
import { HoverableCardProps } from '../../../../types';
import styles from '../../styles/hoverable-card';
import { TrainingDataset } from '../../../../types/training-dataset';

const contentStyles: RebassCardProps = { overflowY: 'unset' };

const Card: FC<HoverableCardProps<TrainingDataset>> = ({
  data,
  handleToggle,
  isSelected,
}) => {
  const navigate = useNavigateRelative();

  const handleNavigate = useCallback(
    (id: number, route: string) => (): void => {
      navigate(route.replace(':tdId', String(id)), 'p/:id/*');
    },
    [navigate],
  );

  return (
    <Box sx={styles(isSelected)}>
      <QuartzCard
        onClick={handleToggle}
        key={data.id}
        contentProps={contentStyles}
      >
        <Flex my="6px" flexDirection="column">
          <Flex alignItems="center">
            <Dot
              ml="12px"
              mainText={data.onlineEnabled ? 'Online' : 'Offline'}
              variant={data.onlineEnabled ? 'green' : 'black'}
            />
            <Subtitle ml="30px">{data.name}</Subtitle>

            <Value mt="auto" ml="5px" mr="15px" sx={{ color: 'labels.purple' }}>
              #{data.id}
            </Value>
            <CardLabels labels={data.labels} />
          </Flex>
          {data.description ? (
            <Labeling mt="15px" gray>
              {data.description}
            </Labeling>
          ) : (
            <Button
              variant="inline"
              p="0"
              mt="15px"
              onClick={handleNavigate(data.id, '/td/:tdId/edit')}
            >
              + add a description
            </Button>
          )}

          <Flex mt="15px" alignItems="center">
            <User name={''} photo={ProfileService.avatar('')} />
            <Flex flexDirection="column" ml="20px">
              <Microlabeling mb="3px" gray>
                Latest version
              </Microlabeling>
              <Value primary>{data.version}</Value>
            </Flex>
            <Flex width="max-content" flexDirection="column" ml="20px">
              <Microlabeling gray mb="3px" width="100%">
                Last update
              </Microlabeling>
              <Flex alignItems="center">
                <FreshnessBar time={data.created.replace('T', ' ')} />
                <Value ml="5px" primary>
                  {formatDistance(new Date(data.created), new Date())} ago
                </Value>
              </Flex>
            </Flex>

            <Flex flexDirection="column" ml="20px">
              <Microlabeling mb="3px" gray>
                Format
              </Microlabeling>
              <Value primary>{data.dataFormat}</Value>
            </Flex>

            <Flex ml="auto">
              <IconButton tooltip="tooltip" icon="eye" />
              <IconButton
                tooltip="Overview"
                tooltipProps={{ ml: '40px' } as TooltipProps}
                icon="ellipsis-v"
                onClick={handleNavigate(data.id, '/td/:tdId')}
              />
              <IconButton
                tooltip="tooltip"
                tooltipProps={{ ml: '6px' } as TooltipProps}
                icon="search"
              />
              <IconButton
                tooltip="tooltip"
                tooltipProps={{ ml: '6px' } as TooltipProps}
                icon="history"
              />
            </Flex>
          </Flex>
        </Flex>
      </QuartzCard>
    </Box>
  );
};

export default memo(Card);

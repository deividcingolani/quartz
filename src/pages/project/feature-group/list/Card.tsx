import {
  Dot,
  Value,
  Button,
  Labeling,
  IconButton,
  FreshnessBar,
  Microlabeling,
  HoverableText,
  Card as QuartzCard,
  User,
} from '@logicalclocks/quartz';
import React, { FC, memo, useCallback } from 'react';
import formatDistance from 'date-fns/formatDistance';
import { Flex, CardProps as RebassCardProps, Box } from 'rebass';
// eslint-disable-next-line import/no-unresolved
import { TooltipProps } from '@logicalclocks/quartz/dist/components/tooltip';

import routeNames from '../../../../routes/routeNames';

// Services
import ProfileService from '../../../../services/ProfileService';
// Types
import { FeatureGroup } from '../../../../types/feature-group';
// Utils
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
// Components
import CardLabels from './CardLabels';
import DateValue from './DateValue';
import { HoverableCardProps } from '../../../../types';
import styles from '../../styles/hoverable-card';

const contentStyles: RebassCardProps = { overflowY: 'unset' };

const Card: FC<HoverableCardProps<FeatureGroup>> = ({
  data,
  isLabelsLoading,
  handleToggle,
  isSelected,
}) => {
  const navigate = useNavigateRelative();

  const handleNavigate = useCallback(
    (id: number, route: string) => (): void => {
      navigate(route.replace(':fgId', String(id)), routeNames.project.view);
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
            <Box ml="12px">
              <Dot
                mainText={data.onlineEnabled ? 'Online' : 'Offline'}
                variant={data.onlineEnabled ? 'green' : 'black'}
              />
            </Box>
            <HoverableText
              fontFamily="Inter"
              onClick={handleNavigate(data.id, '/fg/:fgId')}
              ml="30px"
              fontSize="20px"
            >
              {data.name}
            </HoverableText>

            <Value mt="auto" ml="5px" mr="15px" sx={{ color: 'labels.orange' }}>
              #{data.id}
            </Value>
            <CardLabels labels={data.labels} isLoading={isLabelsLoading} />
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
              onClick={handleNavigate(data.id, routeNames.featureGroup.edit)}
            >
              + add a description
            </Button>
          )}

        <Flex mt="15px" alignItems="center">
          <User
            name={data.creator}
            photo={ProfileService.avatar(data.creator)}
          />
          <Flex flexDirection="column" ml="20px">
            <Microlabeling mb="3px" gray>
              Latest version
            </Microlabeling>
            <Value primary>{data.version}</Value>
          </Flex>
          <DateValue ml="20px" label="Creation" date={new Date(data.created)} />
          <Flex width="max-content" flexDirection="column" ml="20px">
            <Microlabeling gray mb="3px" width="100%">
              Last update
            </Microlabeling>
            <Flex alignItems="center">
              <FreshnessBar time={data.created.replace('T', ' ')} />
              <Value fontFamily="Inter" ml="5px" primary>
                {formatDistance(new Date(data.created), new Date())} ago
              </Value>
            </Flex>
          </Flex>

            {/* Feature group actions */}
            <Flex ml="auto">
              <IconButton tooltip="Preview" icon="eye" />
              <IconButton
                tooltip="Overview"
                tooltipProps={{ ml: '40px' } as TooltipProps}
                icon="ellipsis-v"
                onClick={handleNavigate(data.id, '/fg/:fgId')}
              />
              <IconButton
                tooltip="Data"
                tooltipProps={{ ml: '6px' } as TooltipProps}
                icon="search"
                onClick={handleNavigate(data.id, '/fg/:fgId/statistics')}
              />
              <IconButton
                tooltip="Activity"
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

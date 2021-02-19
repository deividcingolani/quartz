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
  Badge,
  ProjectBadge,
  Symbol,
  SymbolMode,
} from '@logicalclocks/quartz';
import React, { FC, memo, useCallback } from 'react';
import formatDistance from 'date-fns/formatDistance';
import { Flex, Box } from 'rebass';
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
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { useParams } from 'react-router-dom';
import useBasket from '../../../../hooks/useBasket';

const Card: FC<HoverableCardProps<FeatureGroup>> = ({
  data,
  handleToggle,
  isSelected,
  hasMatchText,
  loading,
}) => {
  const { id: projectId } = useParams();

  const navigate = useNavigateRelative();

  const { isActiveFeatures, handleBasket, isSwitch } = useBasket();

  const handleNavigate = useCallback(
    (id: number, route: string) => (): void => {
      navigate(route.replace(':fgId', String(id)), routeNames.project.view);
    },
    [navigate],
  );

  const projectsIds = useSelector((state: RootState) => state.projectsList).map(
    ({ id }) => id,
  );

  return (
    <Box sx={styles(isSelected)}>
      <QuartzCard onClick={handleToggle} key={data.id}>
        <Flex my="6px" flexDirection="column">
          <Flex alignItems="center" justifyContent="space-between">
            <Flex>
              <Box ml="12px" mt="7px">
                <Dot
                  mainText={data.onlineEnabled ? 'Online' : 'Offline'}
                  variant={data.onlineEnabled ? 'green' : 'black'}
                />
              </Box>
              <HoverableText
                fontFamily="Inter"
                onClick={handleNavigate(data.id, '/fg/:fgId')}
                ml="20px"
                fontSize="20px"
                color={
                  !projectsIds.includes(data.parentProjectId) && hasMatchText
                    ? 'gray'
                    : 'initial'
                }
              >
                {data.name}
              </HoverableText>

              <Value
                mt="auto"
                ml="5px"
                mr="15px"
                sx={{ color: 'labels.orange' }}
              >
                #{data.id}
              </Value>
              {isSwitch && (
                <Box onClick={(e) => e.stopPropagation()} ml="-5px" mr="5px">
                  <Symbol
                    handleClick={handleBasket(data.features, data)}
                    mode={SymbolMode.bulk}
                    tooltipMainText={
                      isActiveFeatures(data.features, data)
                        ? 'Remove all features from basket'
                        : 'Add all features to basket'
                    }
                    tooltipSecondaryText={`${data.features.length} features`}
                    inBasket={isActiveFeatures(data.features, data)}
                  />
                </Box>
              )}

              {!projectId && hasMatchText && (
                <ProjectBadge
                  mr="5px"
                  value={data.parentProjectName}
                  isLock={!projectsIds.includes(data.parentProjectId)}
                />
              )}

              <CardLabels ml="5px" loading={loading} labels={data.labels} />
            </Flex>

            {hasMatchText && <Badge value={data.matchText} />}
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
            <DateValue
              ml="20px"
              label="Creation"
              date={new Date(data.created)}
            />
            <Flex width="max-content" flexDirection="column" ml="20px">
              <Microlabeling gray mb="3px" width="100%">
                Last updated
              </Microlabeling>
              {loading ? (
                <Labeling gray>loading</Labeling>
              ) : (
                <Flex alignItems="center">
                  <FreshnessBar time={data.updated.replace('T', ' ')} />
                  <Value fontFamily="Inter" ml="5px" primary>
                    {formatDistance(new Date(data.updated), new Date())} ago
                  </Value>
                </Flex>
              )}
            </Flex>

            {/* Feature group actions */}
            <Flex ml="auto">
              <IconButton tooltip="Preview" icon="eye" />
              <IconButton
                tooltip="Overview"
                tooltipProps={{ ml: '40px' } as TooltipProps}
                icon="ellipsis-v"
                onClick={() => {
                  if (hasMatchText) {
                    navigate(`/p/${data.parentProjectId}/fg/${data.id}`);
                  } else {
                    handleNavigate(data.id, '/fg/:fgId')();
                  }
                }}
              />
              <IconButton
                tooltip="Data"
                tooltipProps={{ ml: '6px' } as TooltipProps}
                icon="search"
                onClick={() => {
                  if (hasMatchText) {
                    navigate(
                      `/p/${data.parentProjectId}/fg/${data.id}/statistics`,
                    );
                  } else {
                    handleNavigate(data.id, '/fg/:fgId/statistics')();
                  }
                }}
              />
              <IconButton
                onClick={handleNavigate(data.id, '/fg/:fgId/activity')}
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

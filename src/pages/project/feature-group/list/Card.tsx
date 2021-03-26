import {
  Dot,
  Value,
  Button,
  Labeling,
  FreshnessBar,
  Microlabeling,
  HoverableText,
  Card as QuartzCard,
  User,
  Badge,
  ProjectBadge,
  Symbol,
  SymbolMode,
  Tooltip,
} from '@logicalclocks/quartz';
import React, { FC, memo, useCallback } from 'react';
import formatDistance from 'date-fns/formatDistance';
import { Flex, Box } from 'rebass';

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
import icons from '../../../../sources/icons';

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
                <Box onClick={(e) => e.stopPropagation()} ml="-5px" mr="10px" mt="5px">
                  <Symbol
                    handleClick={handleBasket(data.features, data)}
                    mode={SymbolMode.bulk}
                    possible={data.features.length > 0}
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

            {hasMatchText && <Badge value={data.matchText} variant="success" />}
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
              width="fit-content"
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
              <Tooltip mainText="Preview">
                <Flex
                  justifyContent="center"
                  alignItems="center"
                  width="34px"
                  height="32px"
                  sx={{
                    boxShadow: '0px 5px 15px rgba(144, 144, 144, 0.2)',
                    borderStyle: 'solid',
                    borderWidth: '1px',
                    borderColor: 'grayShade1',
                    cursor: 'pointer',
                    transition: 'all .25s ease',

                    ':hover': {
                      borderColor: 'black',
                    },
                  }}
                >
                  {icons.eye}
                </Flex>
              </Tooltip>
              <Tooltip ml="40px" mainText="Overview">
                <Flex
                  onClick={() => {
                    if (hasMatchText) {
                      navigate(`/p/${data.parentProjectId}/fg/${data.id}`);
                    } else {
                      handleNavigate(data.id, '/fg/:fgId')();
                    }
                  }}
                  justifyContent="center"
                  alignItems="center"
                  width="34px"
                  height="32px"
                  sx={{
                    boxShadow: '0px 5px 15px rgba(144, 144, 144, 0.2)',
                    borderStyle: 'solid',
                    borderWidth: '1px',
                    borderColor: 'grayShade1',
                    cursor: 'pointer',
                    transition: 'all .25s ease',

                    ':hover': {
                      borderColor: 'black',
                    },
                  }}
                >
                  {icons.more_zoom}
                </Flex>
              </Tooltip>
              <Tooltip
                ml="6px"
                mainText={
                  data.statisticsConfig.enabled
                    ? 'Statistics'
                    : 'Statistics are disabled'
                }
              >
                <Flex
                  onClick={(e) => {
                    if (hasMatchText) {
                      navigate(
                        `/p/${data.parentProjectId}/fg/${data.id}/statistics`,
                      );
                    } else {
                      if (data.statisticsConfig.enabled) {
                        handleNavigate(data.id, '/fg/:fgId/statistics')();
                      } else {
                        e.stopPropagation();
                      }
                    }
                  }}
                  justifyContent="center"
                  alignItems="center"
                  width="34px"
                  height="32px"
                  sx={{
                    boxShadow: '0px 5px 15px rgba(144, 144, 144, 0.2)',
                    borderStyle: 'solid',
                    borderWidth: '1px',
                    borderColor: 'grayShade1',
                    cursor: 'pointer',
                    transition: 'all .25s ease',
                    backgroundColor: data.statisticsConfig.enabled
                      ? 'initial'
                      : 'grayShade3',

                    ':hover': {
                      borderColor: data.statisticsConfig.enabled
                        ? 'black'
                        : 'grayShade1',
                    },
                  }}
                >
                  {icons.stats}
                </Flex>
              </Tooltip>

              <Tooltip ml="6px" mainText="Activity">
                <Flex
                  onClick={() => {
                    if (hasMatchText) {
                      navigate(
                        `/p/${data.parentProjectId}/fg/${data.id}/activity`,
                      );
                    } else {
                      handleNavigate(data.id, '/fg/:fgId/activity')();
                    }
                  }}
                  justifyContent="center"
                  alignItems="center"
                  width="34px"
                  height="32px"
                  sx={{
                    boxShadow: '0px 5px 15px rgba(144, 144, 144, 0.2)',
                    borderStyle: 'solid',
                    borderWidth: '1px',
                    borderColor: 'grayShade1',
                    cursor: 'pointer',
                    transition: 'all .25s ease',

                    ':hover': {
                      borderColor: 'black',
                    },
                  }}
                >
                  {icons.history}
                </Flex>
              </Tooltip>
            </Flex>
          </Flex>
        </Flex>
      </QuartzCard>
    </Box>
  );
};

export default memo(Card);

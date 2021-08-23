// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, useCallback } from 'react';
import {
  Dot,
  Value,
  Button,
  Labeling,
  FreshnessBar,
  Microlabeling,
  Card as QuartzCard,
  User,
  Badge,
  ProjectBadge,
  Symbol,
  SymbolMode,
  Tooltip,
  HoverableLink,
} from '@logicalclocks/quartz';
import formatDistance from 'date-fns/formatDistance';
import { Flex, Box } from 'rebass';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import routeNames from '../../../../routes/routeNames';
import useGetHrefForRoute from '../../../../hooks/useGetHrefForRoute';

// Types
import { FeatureGroup } from '../../../../types/feature-group';
// Utils
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
// Components
import CardLabels from './CardLabels';
import DateValue from './DateValue';
import { HoverableCardProps } from '../../../../types';
import styles from '../../styles/hoverable-card';
import { RootState } from '../../../../store';
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

  const getHref = useGetHrefForRoute();

  const handleNavigate = useCallback(
    (id: number, fsId: number, route: string) => (): void => {
      navigate(
        route.replace(':fsId', String(fsId)).replace(':fgId', String(id)),
        `/${routeNames.project.view}`,
      );
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
              <HoverableLink
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (hasMatchText) {
                    navigate(
                      `/p/${data.parentProjectId}/fs/${data.featurestoreId}/fg/${data.id}`,
                    );
                  } else {
                    handleNavigate(
                      data.id,
                      data.featurestoreId,
                      '/fs/:fsId/fg/:fgId',
                    )();
                  }
                }}
                href={
                  hasMatchText
                    ? `/p/${data.parentProjectId}/fs/${data.featurestoreId}/fg/${data.id}`
                    : getHref(
                        `/fs/${data.featurestoreId}/fg/${data.id}`,
                        `/${routeNames.project.view}`,
                      )
                }
                sx={{
                  textDecoration: 'none',
                  marginLeft: '20px',
                  fontSize: '20px',
                  fontFamily: 'Inter',
                  color:
                    !projectsIds.includes(data.parentProjectId) && hasMatchText
                      ? 'gray'
                      : 'initial',
                }}
              >
                {data.name}
              </HoverableLink>

              <Value
                mt="auto"
                ml="5px"
                mr="15px"
                sx={{ color: 'labels.orange' }}
              >
                #{data.id}
              </Value>
              {isSwitch && (
                <Box
                  onClick={(e) => e.stopPropagation()}
                  ml="-5px"
                  mr="10px"
                  mt="5px"
                >
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

            {hasMatchText && <Badge value={data.matchText} variant="warning" />}
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
              onClick={handleNavigate(
                data.id,
                data.featurestoreId,
                routeNames.featureGroup.edit,
              )}
            >
              + add a description
            </Button>
          )}

          <Flex mt="15px" alignItems="center">
            <User
              firstName={data.creator.firstName}
              lastName={data.creator.lastName}
            />
            <Flex flexDirection="column" ml="20px">
              <Microlabeling mb="3px" gray>
                Version
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
                      navigate(
                        `/p/${data.parentProjectId}/fs${data.featurestoreId}/fg/${data.id}`,
                      );
                    } else {
                      handleNavigate(
                        data.id,
                        data.featurestoreId,
                        '/fs/:fsId/fg/:fgId',
                      )();
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
                        `/p/${data.parentProjectId}/fs/${data.featurestoreId}/fg/${data.id}/statistics`,
                      );
                    } else if (data.statisticsConfig.enabled) {
                      handleNavigate(
                        data.id,
                        data.featurestoreId,
                        '/fs/:fsId/fg/:fgId/statistics',
                      )();
                    } else {
                      e.stopPropagation();
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
                        `/p/${data.parentProjectId}/fs/${data.featurestoreId}/fg/${data.id}/activity`,
                      );
                    } else {
                      handleNavigate(
                        data.id,
                        data.featurestoreId,
                        '/fs/:fsId/fg/:fgId/activity',
                      )();
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

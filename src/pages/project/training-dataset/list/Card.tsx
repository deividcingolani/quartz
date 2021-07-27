// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, useCallback } from 'react';
import {
  Value,
  Button,
  Labeling,
  FreshnessBar,
  Microlabeling,
  Card as QuartzCard,
  User,
  Badge,
  ProjectBadge,
  HoverableLink,
  Tooltip,
} from '@logicalclocks/quartz';
import formatDistance from 'date-fns/formatDistance';
import { Flex, Box } from 'rebass';

import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ProfileService from '../../../../services/ProfileService';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import { HoverableCardProps } from '../../../../types';
import styles from '../../styles/hoverable-card';
import { TrainingDataset } from '../../../../types/training-dataset';
import { RootState } from '../../../../store';
import CardLabels from '../../feature-group/list/CardLabels';
import icons from '../../../../sources/icons';
import routeNames from '../../../../routes/routeNames';
import useGetHrefForRoute from '../../../../hooks/useGetHrefForRoute';

const Card: FC<HoverableCardProps<TrainingDataset>> = ({
  data,
  handleToggle,
  isSelected,
  hasMatchText,
  loading,
}) => {
  const { id: projectId } = useParams();

  const navigate = useNavigateRelative();

  const handleNavigate = useCallback(
    (id: number, route: string) => (): void => {
      navigate(route.replace(':tdId', String(id)), routeNames.project.view);
    },
    [navigate],
  );

  const getHref = useGetHrefForRoute();

  const projectsIds = useSelector((state: RootState) => state.projectsList).map(
    ({ id }) => id,
  );

  return (
    <Box sx={styles(isSelected)}>
      <QuartzCard onClick={handleToggle} key={data.id}>
        <Flex my="6px" flexDirection="column">
          <Flex alignItems="center" justifyContent="space-between">
            <Flex>
              <HoverableLink
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (hasMatchText) {
                    navigate(`/p/${data.parentProjectId}/td/${data.id}`);
                  } else {
                    handleNavigate(data.id, '/td/:tdId')();
                  }
                }}
                href={
                  hasMatchText
                    ? `/p/${data.parentProjectId}/td/${data.id}`
                    : getHref(
                        '/td/:tdId'.replace(':tdId', String(data.id)),
                        routeNames.project.view,
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
                sx={{ color: 'labels.purple' }}
              >
                #{data.id}
              </Value>

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
              onClick={handleNavigate(data.id, '/td/:tdId/edit')}
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
                Version
              </Microlabeling>
              <Value primary>{data.version}</Value>
            </Flex>
            <Flex width="max-content" flexDirection="column" ml="20px">
              <Microlabeling gray mb="3px" width="100%">
                Last updated
              </Microlabeling>
              {loading ? (
                <Labeling gray>loading</Labeling>
              ) : (
                <Flex alignItems="center">
                  <FreshnessBar time={data.updated.replace('T', ' ')} />
                  <Value ml="5px" primary>
                    {formatDistance(new Date(data.updated), new Date())} ago
                  </Value>
                </Flex>
              )}
            </Flex>

            <Flex flexDirection="column" ml="20px">
              <Microlabeling mb="3px" gray>
                Format
              </Microlabeling>
              <Value primary>{data.dataFormat}</Value>
            </Flex>

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
                      navigate(`/p/${data.parentProjectId}/td/${data.id}`);
                    } else {
                      handleNavigate(data.id, '/td/:tdId')();
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
              <Tooltip ml="6px" mainText="Statistics">
                <Flex
                  onClick={(e) => {
                    if (hasMatchText) {
                      navigate(
                        `/p/${data.parentProjectId}/td/${data.id}/statistics`,
                      );
                    } else if (data.statisticsConfig.enabled) {
                      handleNavigate(data.id, '/td/:tdId/statistics')();
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
                      navigate(`/p/${data.parentProjectId}/td/${data.id}`);
                    } else {
                      handleNavigate(data.id, '/td/:tdId')();
                    }
                  }}
                  justifyContent="center"
                  alignItems="center"
                  width="34px"
                  height="32px"
                  sx={{
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

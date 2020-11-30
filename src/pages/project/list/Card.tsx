import {
  Value,
  Button,
  Labeling,
  FreshnessBar,
  Microlabeling,
  HoverableText,
  Card as QuartzCard,
  Tooltip,
  TinyPopup,
  usePopup,
  User,
} from '@logicalclocks/quartz';
import React, { FC, memo, useCallback } from 'react';
import formatDistance from 'date-fns/formatDistance';
import { Flex, CardProps as RebassCardProps } from 'rebass';

// Types
import { Project } from '../../../types/project';
// Hooks
import useNavigateRelative from '../../../hooks/useNavigateRelative';

import routeNames from '../../../routes/routeNames';
import ProfileService from '../../../services/ProfileService';
import { useDispatch } from 'react-redux';
import { Dispatch } from '../../../store';

const contentStyles: RebassCardProps = {
  overflowY: 'unset',
};

export interface CardProps {
  data: Project;
}

const Card: FC<CardProps> = ({ data }: CardProps) => {
  const navigate = useNavigateRelative();
  const dispatch = useDispatch<Dispatch>();

  const [isPopupOpen, handleToggle] = usePopup();

  const handleNavigate = useCallback(
    (route: string) => () => {
      navigate(route.replace(':id', data.id.toString()));
    },
    [navigate, data],
  );

  const handleDelete = useCallback(async () => {
    await dispatch.project.delete({
      id: data.id,
    });
    dispatch.projectsList.getProjects();
  }, [data, dispatch]);

  return (
    <>
      <QuartzCard
        mb="20px"
        key={data.id}
        style={{ boxShadow: '1px 1px 28px 1px rgba(0, 0, 0, 0.07)' }}
        contentProps={contentStyles}
      >
        <Flex my="6px" flexDirection="column">
          <Flex justifyContent="space-between" alignItems="center">
            <Flex>
              <HoverableText
                fontFamily="Inter"
                onClick={handleNavigate(routeNames.project.viewHome)}
                fontSize="20px"
              >
                {data.name}
              </HoverableText>

              <Value
                mt="auto"
                ml="5px"
                mr="15px"
                sx={{ color: 'labels.green' }}
              >
                #{data.id}
              </Value>
            </Flex>
            <Flex>
              {data.name.includes('demo_') && (
                <Button mr="20px" intent="ghost" onClick={handleToggle}>
                  Delete Demo
                </Button>
              )}
              <Button onClick={handleNavigate(routeNames.project.viewHome)}>
                Open project
              </Button>
            </Flex>
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
              onClick={handleNavigate(routeNames.project.edit)}
            >
              + add a description
            </Button>
          )}

          <Flex mt="15px" alignItems="center">
            <Flex flexDirection="column">
              <Microlabeling mb="3px" gray>
                Feature Groups
              </Microlabeling>
              <Value primary>{data.id}</Value>
            </Flex>
            <Flex flexDirection="column" ml="30px">
              <Microlabeling mb="3px" gray>
                Training Datasets
              </Microlabeling>
              <Value primary>{data.id}</Value>
            </Flex>
            <Flex width="max-content" flexDirection="column" ml="30px">
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
            <Tooltip
              ml="40px"
              mt="10px"
              mainText={data.user.email}
              secondaryText="author"
            >
              <User name={''} photo={ProfileService.avatar(data.user.email)} />
            </Tooltip>
          </Flex>
        </Flex>
      </QuartzCard>
      <TinyPopup
        title={`Delete ${data.name}`}
        secondaryText="The project will be definitely deleted"
        isOpen={isPopupOpen}
        mainButton={['Delete the project', handleDelete]}
        secondaryButton={['Back', handleToggle]}
        onClose={handleToggle}
      />
    </>
  );
};

export default memo(Card);

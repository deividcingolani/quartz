// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback } from 'react';
import { Button, Card, Labeling } from '@logicalclocks/quartz';
import { useParams } from 'react-router-dom';
import { Box, Flex } from 'rebass';

// Types
import { useSelector } from 'react-redux';
import { Tag } from '../../../../types';
// Hooks
import SchematisedTagListRowData from './SchematisedTagsListRowData';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
// Styles

import routeNames from '../../../../routes/routeNames';
import { RootState } from '../../../../store';
import useGetHrefForRoute from '../../../../hooks/useGetHrefForRoute';
import { ItemDrawerTypes } from '../../../../components/drawer/ItemDrawer';

export interface SchematisedTagsProps {
  data: Tag[];
  type?: ItemDrawerTypes;
}

const SchematisedTags: FC<SchematisedTagsProps> = ({
  data = [],
  type = ItemDrawerTypes.fg,
}) => {
  const { [`${type}Id`]: id, fsId } = useParams();

  const navigate = useNavigateRelative();

  const getHref = useGetHrefForRoute();

  const handleNavigate = useCallback(
    (id: number, route: string) => (): void => {
      navigate(
        route.replace(':fsId', fsId).replace(`:${type}Id`, String(id)),
        routeNames.project.view,
      );
    },
    // eslint-disable-next-line
    [navigate],
  );

  const isLoadingTD = useSelector(
    (state: RootState) =>
      state.loading.effects.trainingDatasetView.loadRemainingData,
  );

  const isLoadingFG = useSelector(
    (state: RootState) =>
      state.loading.effects.featureGroupView.loadRemainingData,
  );

  const groupType = type === 'fg' ? 'featureGroup' : 'trainingDataset';

  if (isLoadingFG || isLoadingTD) {
    return (
      <Card
        mt="20px"
        title="Tags"
        actions={
          <Button
            p={0}
            intent="inline"
            href={getHref(
              routeNames[groupType].edit.replace(`:${type}Id`, String(+id)),
              routeNames.project.view,
            )}
            onClick={handleNavigate(+id, routeNames[groupType].edit)}
          >
            add/remove tags
          </Button>
        }
      >
        <Box mt="20px" mx="-20px">
          <Flex height="50px" mt="30px" justifyContent="center">
            <Labeling fontSize="18px" gray>
              Loading...
            </Labeling>
          </Flex>
        </Box>
      </Card>
    );
  }

  return (
    <Card
      mt="20px"
      title="Tags"
      actions={
        <Button
          p={0}
          href={getHref(
            routeNames[groupType].edit.replace(`:${type}Id`, String(+id)),
            routeNames.project.view,
          )}
          intent="inline"
          onClick={handleNavigate(+id, routeNames[groupType].edit)}
        >
          edit
        </Button>
      }
    >
      {!data.length && (
        <Flex
          mt="20px"
          mb="20px"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Labeling gray fontSize="18px">
            There are no tags attached
          </Labeling>
          <Button
            mt="20px"
            href={getHref(
              routeNames[groupType].edit.replace(`:${type}Id`, String(+id)),
              routeNames.project.view,
            )}
            onClick={handleNavigate(+id, routeNames[groupType].edit)}
          >
            Add tags
          </Button>
        </Flex>
      )}

      {!!data.length &&
        data.map((tag: Tag, index: number) => {
          return (
            <Box key={tag.name}>
              <SchematisedTagListRowData tag={tag} index={index} type={type} />
            </Box>
          );
        })}
    </Card>
  );
};

export default SchematisedTags;

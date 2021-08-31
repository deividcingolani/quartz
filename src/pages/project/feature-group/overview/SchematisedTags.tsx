// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental

import React, { FC, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Labeling } from '@logicalclocks/quartz';
import { Box, Flex } from 'rebass';

// Types
import { useSelector } from 'react-redux';
import { Tag } from '../../../../types';
// Hooks
import SchematisedTagListRowData from './SchematisedTagsListRowData';
// Styles

import routeNames from '../../../../routes/routeNames';
import { RootState } from '../../../../store';
import { ItemDrawerTypes } from '../../../../components/drawer/ItemDrawer';
import getHrefNoMatching from '../../../../utils/getHrefNoMatching';

export interface SchematisedTagsProps {
  data: Tag[];
  type?: ItemDrawerTypes;
}

const SchematisedTags: FC<SchematisedTagsProps> = ({
  data = [],
  type = ItemDrawerTypes.fg,
}) => {
  const { [`${type}Id`]: id, fsId, id: projectId } = useParams();

  const navigate = useNavigate();

  const getHref = useCallback(
    (id: number, groupType: 'featureGroup' | 'trainingDataset') => {
      return getHrefNoMatching(
        routeNames[groupType].edit,
        routeNames.project.value,
        true,
        { fsId, id: projectId, [`${type}Id`]: String(id) },
      );
    },
    [fsId, projectId, type],
  );

  const handleNavigate = useCallback(
    (id: number, groupType: 'featureGroup' | 'trainingDataset') => (): void => {
      navigate(getHref(id, groupType));
    },
    [getHref, navigate],
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
            href={getHref(+id, groupType)}
            onClick={handleNavigate(+id, groupType)}
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
          href={getHref(+id, groupType)}
          intent="inline"
          onClick={handleNavigate(+id, groupType)}
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
            href={getHref(+id, groupType)}
            onClick={handleNavigate(+id, groupType)}
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

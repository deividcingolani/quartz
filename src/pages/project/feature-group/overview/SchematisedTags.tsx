// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, {
  ComponentType,
  FC,
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  Button,
  Card,
  Labeling,
  Row as QRow,
  Select,
  Value,
} from '@logicalclocks/quartz';
import { useParams } from 'react-router-dom';
import { Box, Flex } from 'rebass';

// Types
import { useSelector } from 'react-redux';
import { Tag } from '../../../../types';
// Hooks
import useSchematisedTagsListRowData from './useSchematisedTagsListRowData';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
// Styles
import tagsListStyles from './tags-list-styles';

import routeNames from '../../../../routes/routeNames';
import { RootState } from '../../../../store';
import useGetHrefForRoute from '../../../../hooks/useGetHrefForRoute';
import { ItemDrawerTypes } from '../../../../components/drawer/ItemDrawer';

export interface SchematisedTagsProps {
  data: Tag[];
  type?: ItemDrawerTypes;
}

const Row = memo(QRow);

const SchematisedTags: FC<SchematisedTagsProps> = ({
  data = [],
  type = ItemDrawerTypes.fg,
}) => {
  const { [`${type}Id`]: id } = useParams();

  const [selected, setSelected] = useState<Tag>(data[0]);

  const navigate = useNavigateRelative();

  const getHref = useGetHrefForRoute();

  const handleNavigate = useCallback(
    (id: number, route: string) => (): void => {
      navigate(
        route.replace(`:${type}Id`, String(id)),
        routeNames.project.view,
      );
    },
    // eslint-disable-next-line
    [navigate],
  );

  const onChange = useCallback(
    (value) => {
      const tag = data.find(({ name }) => name === value[0]);
      if (tag) {
        setSelected(tag);
      }
    },
    [data],
  );

  useEffect(() => {
    setSelected(data[0]);
  }, [data]);

  const [groupComponents, groupProps] = useSchematisedTagsListRowData(selected);
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
            edit
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
      title="Tag schemas"
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
        <Flex mt="20px" mb="20px" justifyContent="center">
          <Labeling gray fontSize="18px">
            {type === ItemDrawerTypes.fg
              ? 'There are no tags added to this feature group'
              : 'There are no tags added to this training dataset'}
          </Labeling>
        </Flex>
      )}

      {!!data.length && (
        <>
          <Flex>
            <Value primary>{data.length}</Value>
            <Labeling ml="5px" gray mr="5px">
              {data.length > 1
                ? 'tag schemas attached:'
                : 'tag schema attached:'}
            </Labeling>
            <Value primary>{data.map(({ name }) => name).join(', ')}</Value>
          </Flex>

          <Select
            mt="20px"
            listWidth="100%"
            options={data.map(({ name }) => name)}
            value={[selected?.name || 'none']}
            placeholder="schema"
            onChange={onChange}
          />
          <Box mt="20px" mx="-20px" sx={tagsListStyles}>
            <Row
              middleColumn={1}
              groupComponents={groupComponents as ComponentType<any>[][]}
              groupProps={groupProps}
            />
          </Box>
        </>
      )}
    </Card>
  );
};

export default SchematisedTags;

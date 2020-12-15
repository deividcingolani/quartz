import { Box, Flex } from 'rebass';
import React, { ComponentType, FC, memo, useCallback, useState } from 'react';
import {
  Button,
  Card,
  Icon,
  Labeling,
  Row as QRow,
  Select,
  Tooltip,
  Value,
} from '@logicalclocks/quartz';
import { useParams } from 'react-router-dom';

// Types
import { Tag } from '../../../../types';
// Hooks
import useSchematisedTagsListRowData from './useSchematisedTagsListRowData';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
// Styles
import tagsListStyles from './tags-list-styles';

import routeNames from '../../../../routes/routeNames';

export interface SchematisedTagsProps {
  data: Tag[];
}

const Row = memo(QRow);

const SchematisedTags: FC<SchematisedTagsProps> = ({ data = [] }) => {
  const { fgId } = useParams();

  const [selected, setSelected] = useState<Tag>(data[0]);

  const navigate = useNavigateRelative();

  const handleNavigate = useCallback(
    (id: number, route: string) => (): void => {
      navigate(route.replace(':fgId', String(id)), routeNames.project.view);
    },
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

  const [groupComponents, groupProps] = useSchematisedTagsListRowData(selected);

  return (
    <Card
      mt="20px"
      title={
        <>
          Schematised Tags{' '}
          <Tooltip mainText="Tooltip" ml="5px">
            <Icon icon="info-circle" size="sm" />
          </Tooltip>
        </>
      }
      actions={
        <Button
          p={0}
          intent="inline"
          onClick={handleNavigate(+fgId, routeNames.featureGroup.edit)}
        >
          edit
        </Button>
      }
    >
      {!data.length && (
        <Flex mt="20px" mb="20px" justifyContent="center">
          <Labeling gray fontSize="18px">
            No tags defined
          </Labeling>
        </Flex>
      )}

      {!!data.length && (
        <>
          <Flex>
            <Value primary>{data.length}</Value>
            <Labeling ml="5px" gray mr="5px">
              schematised tags attached:
            </Labeling>
            <Value primary>{data.map(({ name }) => name).join(', ')}</Value>
          </Flex>

          <Select
            mt="20px"
            listWidth="100%"
            options={data.map(({ name }) => name)}
            value={[selected.name]}
            placeholder="display"
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

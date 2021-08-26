// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { ComponentType, FC, useCallback, useState } from 'react';
import { Row, Card, Labeling, Value, Button } from '@logicalclocks/quartz';
import { Box, Flex } from 'rebass';

// Styles
import { useNavigate } from 'react-router-dom';
import styles from './list-styles';
// Hooks
import { SchematisedTagEntity } from '../../../../types/feature-group';
import useSchematisedTagsListRows from './useSchematisedTagsListRows';
import SchematisedTagDrawer from './SchematisedTagDrawer';
import routeNames from '../../../../routes/routeNames';

export interface SchematisedTagsListContentProps {
  data: SchematisedTagEntity[];
}

const contentProps = {
  pb: 0,
};

const SchematisedTagsListContent: FC<SchematisedTagsListContentProps> = ({
  data,
}) => {
  const [selectedTag, setSelectedTag] = useState<SchematisedTagEntity>();

  const navigate = useNavigate();

  const handleCreate = useCallback(() => {
    navigate(routeNames.settings.schematisedTags.create);
  }, [navigate]);

  const handleView = useCallback(
    (name: string) => {
      const selected = data.find(({ name: tagName }) => tagName === name);
      setSelectedTag(selected);
    },
    [data],
  );

  const [groupComponents, groupProps] = useSchematisedTagsListRows(
    data,
    handleView,
  );

  if (data.length) {
    return (
      <>
        {!!selectedTag && (
          <SchematisedTagDrawer
            data={selectedTag}
            isOpen={!!selectedTag}
            handleToggle={() => setSelectedTag(undefined)}
          />
        )}

        <Card title="All tags schemas" contentProps={contentProps}>
          <Flex alignItems="center" justifyContent="space-between" pb="15px">
            <Flex>
              <Value primary>{data.length}</Value>
              <Labeling bold ml="5px">
                {data.length > 1 ? 'tag schemas' : 'tag schema'}
              </Labeling>
            </Flex>
            <Flex>
              <Button onClick={handleCreate}>New tag schema</Button>
            </Flex>
          </Flex>
          <Box mx="-20px" sx={styles}>
            <Row
              onRowClick={(_, index) => {
                const { name } = data[index];

                handleView(name);
              }}
              middleColumn={2}
              groupComponents={groupComponents as ComponentType<any>[][]}
              groupProps={groupProps}
            />
          </Box>
        </Card>
      </>
    );
  }

  return (
    <Card title="All tag schemas" contentProps={contentProps}>
      <Flex
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        height="190px"
      >
        <Labeling fontSize="18px" gray mb="20px">
          There are no tag schema defined
        </Labeling>
        <Button onClick={handleCreate}>New tag schemas</Button>
      </Flex>
    </Card>
  );
};

export default SchematisedTagsListContent;

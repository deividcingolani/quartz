// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { ComponentType, FC } from 'react';
import { Box, Flex } from 'rebass';
import { Labeling, Row, Value } from '@logicalclocks/quartz';

import { Tag } from '../../types';
import useSchematisedTagsListRowData from './useSchematisedTagsListRowData';

const SchematisedTagTable: FC<{ tag: Tag }> = ({ tag: { tags, name } }) => {
  const [schematisedTagsComponents, schematisedTagsProps] =
    useSchematisedTagsListRowData(tags);

  return (
    <Flex mb="20px" flexDirection="column">
      <Flex alignSelf="flex-end" mb="8px">
        <Labeling gray mr="3px">
          from
        </Labeling>
        <Value primary>{name}</Value>
      </Flex>
      <Box
        sx={{
          borderRightStyle: 'solid',
          borderRightWidth: '1px',
          borderLeftStyle: 'solid',
          borderLeftWidth: '1px',
          borderColor: 'grayShade2',

          table: {
            td: {
              pl: '10px !important',
              pr: '14px !important',
              whiteSpace: 'nowrap',
            },
          },
        }}
      >
        <Row
          middleColumn={0}
          groupComponents={schematisedTagsComponents as ComponentType<any>[][]}
          groupProps={schematisedTagsProps}
        />
      </Box>
    </Flex>
  );
};

export default SchematisedTagTable;

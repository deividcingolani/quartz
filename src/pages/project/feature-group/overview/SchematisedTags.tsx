import { Flex } from 'rebass';
import React, { FC } from 'react';
import { Button, Card, Icon, Labeling, Tooltip } from '@logicalclocks/quartz';

export interface SchematisedTagsProps {}

const SchematisedTags: FC<SchematisedTagsProps> = () => {
  return (
    <Card
      mt="20px"
      title={
        <>
          Schematised Tags{' '}
          <Tooltip mainText="Toolttip" ml="5px">
            <Icon icon="info-circle" size="sm" />
          </Tooltip>
        </>
      }
      actions={
        <Button p={0} intent="inline">
          edit
        </Button>
      }
    >
      <Flex>
        <Labeling gray mr="5px">
          from
        </Labeling>
        <Button intent="inline" p={0}>
          template_1
        </Button>
      </Flex>
    </Card>
  );
};

export default SchematisedTags;

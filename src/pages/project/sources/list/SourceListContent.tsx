import {
  Row,
  Card,
  Text,
  Badge,
  Button,
  Labeling,
  IconButton,
} from '@logicalclocks/quartz';
import { Box, Flex } from 'rebass';
import React, { ComponentType, FC, useMemo } from 'react';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';

// Types
import { FeatureStoreSource } from '../../../../types/feature-store';
// Styles
import styles from './source-list.styles';
import routeNames from '../../../../routes/routeNames';

export interface SourceListContentProps {
  data: FeatureStoreSource[];
}

const contentProps = {
  pb: 0,
};

const SourceListContent: FC<SourceListContentProps> = ({ data }) => {
  const navigate = useNavigateRelative();

  const handleCreate = () => {
    navigate('/sources/new', 'p/:id*');
  };

  const cardText = `${data.length} source${
    data.length > 1 ? 's' : ''
  } setted up`;

  const groupComponents = useMemo(() => {
    return new Array(data.length)
      .fill(null)
      .map(() => [Labeling, Badge, Labeling, IconButton]);
  }, [data]);

  const groupProps = useMemo(() => {
    return data.map(({ id, name, storageConnectorType, description }) => [
      {
        children: name,
        bold: true,
      },
      {
        value: storageConnectorType,
        variant: 'bold',
        width: 'max-content',
      },
      {
        children: description,
        gray: true,
        bold: true,
      },
      {
        icon: 'pen',
        intent: 'ghost',
        tooltip: 'Edit',
        onClick: () =>
          navigate(
            routeNames.source.edit
              .replace(':sourceId', id.toString())
              .replace(':connectorType', storageConnectorType),
            routeNames.project.view,
          ),
      },
    ]);
  }, [data, navigate]);

  return (
    <Card title="Sources" contentProps={contentProps}>
      <Flex alignItems="center" pb="15px">
        <Text>{cardText}</Text>
        <Button ml="auto" onClick={handleCreate}>
          Setup New Source
        </Button>
      </Flex>
      <Box mx="-20px" sx={styles}>
        <Row
          middleColumn={2}
          groupComponents={groupComponents as ComponentType<any>[][]}
          groupProps={groupProps}
        />
      </Box>
    </Card>
  );
};

export default SourceListContent;

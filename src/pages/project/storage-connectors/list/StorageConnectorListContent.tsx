import {
  Row,
  Card,
  Text,
  Badge,
  Button,
  Labeling,
  Tooltip,
} from '@logicalclocks/quartz';
import { Box, Flex } from 'rebass';
import React, { ComponentType, FC, useMemo } from 'react';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';

// Types
import { FeatureStoreStorageConnector } from '../../../../types/feature-store';
// Styles
import styles from './storage-connector-list.styles';
import routeNames from '../../../../routes/routeNames';
import useGetHrefForRoute from '../../../../hooks/useGetHrefForRoute';
import icons from '../../../../sources/icons';

export interface StorageConnectorListContentProps {
  data: FeatureStoreStorageConnector[];
}

const contentProps = {
  pb: 0,
};

const StorageConnectorListContent: FC<StorageConnectorListContentProps> = ({
  data,
}) => {
  const navigate = useNavigateRelative();

  const handleCreate = () => {
    navigate('/storage-connectors/new', 'p/:id*');
  };

  const getHref = useGetHrefForRoute();

  const cardText = `${data.length} storage connector${
    data.length > 1 ? 's' : ''
  }`;

  const groupComponents = useMemo(() => {
    return new Array(data.length)
      .fill(null)
      .map(() => [Labeling, Badge, Labeling, Tooltip]);
  }, [data]);

  const groupProps = useMemo(() => {
    return data.map(({ name, storageConnectorType, description }) => [
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
        mr: '10px',
        mainText: 'Edit',
        children: (
          <Box
            p="5px"
            height="28px"
            sx={{
              cursor: 'pointer',
              backgroundColor: '#ffffff',
              transition: 'all .4s ease',

              ':hover': {
                backgroundColor: 'grayShade3',
              },

              svg: {
                width: '20px',
                height: '20px',
              },
            }}
            onClick={() =>
              navigate(
                routeNames.storageConnector.edit.replace(
                  ':connectorName',
                  name,
                ),
                routeNames.project.view,
              )
            }
          >
            {icons.edit}
          </Box>
        ),
      },
    ]);
  }, [data, navigate]);

  return (
    <Card mb="40px" title="Storage connectors" contentProps={contentProps}>
      <Flex justifyContent="space-between" alignItems="center" pb="15px">
        <Text>{cardText}</Text>
        <Button
          href={getHref('/storage-connectors/new', 'p/:id*')}
          onClick={handleCreate}
        >
          Set up new storage connector
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

export default StorageConnectorListContent;

// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { ComponentType, FC, useMemo } from 'react';
import {
  Row,
  Card,
  Text,
  Badge,
  Button,
  Labeling,
  Tooltip,
  Select,
} from '@logicalclocks/quartz';
import { Box, Flex } from 'rebass';
// Types
import { FeatureStoreStorageConnector } from '../../../../types/feature-store';
// Styles
import styles from './storage-connector-list.styles';
import icons from '../../../../sources/icons';
import Loader from '../../../../components/loader/Loader';
import NoData from '../../../../components/no-data/NoData';
// Hooks
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import useGetHrefForRoute from '../../../../hooks/useGetHrefForRoute';
import useUserPermissions from '../../feature-group/overview/useUserPermissions';

export interface StorageConnectorListContentProps {
  selectedFs: string[];
  isLoading: boolean;
  data: FeatureStoreStorageConnector[];
  hasSharedFS: boolean;
  setSelectedFs: ([value]: any) => void;
  selectFSOpts: string[];
}

const contentProps = {
  pb: 0,
};

const StorageConnectorListContent: FC<StorageConnectorListContentProps> = ({
  data,
  isLoading,
  selectedFs,
  hasSharedFS,
  selectFSOpts,
  setSelectedFs,
}) => {
  const navigate = useNavigateRelative();

  const handleCreate = () => {
    navigate('/storage-connectors/new', 'p/:id/fs/:fsId/*');
  };

  const { canEdit, isLoading: isPermissionsLoading } = useUserPermissions();

  const getHref = useGetHrefForRoute();

  const cardText = `${data.length} storage connector${
    data.length > 1 ? 's' : ''
  }`;

  const groupComponents = useMemo(() => {
    return new Array(data.length)
      .fill(null)
      .map(() => [Labeling, Badge, Labeling, Tooltip]);
  }, [data]);

  const userCanEdit = canEdit && !isPermissionsLoading;

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
        mainText: userCanEdit
          ? 'Edit'
          : 'You have no edit right on the feature store',
        children: (
          <Box
            p="5px"
            height="28px"
            sx={{
              cursor: userCanEdit ? 'pointer' : '',
              backgroundColor: '#ffffff',
              transition: 'all .4s ease',

              ':hover': {
                backgroundColor: 'grayShade3',
              },

              svg: {
                width: '20px',
                height: '20px',
                ...(!userCanEdit && {
                  path: {
                    fill: '#a0a0a0',
                  },
                }),
              },
            }}
            onClick={() => {
              if (userCanEdit) {
                navigate(`/${name}/edit`, 'p/:id/fs/:fsId/storage-connectors');
              }
            }}
          >
            {icons.edit}
          </Box>
        ),
      },
    ]);
  }, [data, navigate, userCanEdit]);

  const handleNavigate = (to: string) => () => {
    navigate(to, 'p/:id/fs/:fsId/storage-connectors');
  };

  const CardContent = () => {
    if (isLoading) return <Loader />;
    if (!data?.length) {
      return (
        <Flex my="20px" justifyContent="center">
          <NoData
            mainText={
              hasSharedFS
                ? 'No storage connector setted up for this feature store'
                : 'No storage connector setted up'
            }
            secondaryText={
              hasSharedFS
                ? 'Define your storage connector or select another feature store'
                : 'Define your storage connector to let Hopsworks go through it and import feature groups'
            }
          >
            <Button
              href={getHref('/new', 'p/:id/fs/:fsId/storage-connectors/')}
              intent="secondary"
              onClick={handleNavigate('/new')}
            >
              Set up a storage connector
            </Button>
            <Button
              ml="20px"
              intent="primary"
              href={getHref(
                '/import-sample',
                'p/:id/fs/:fsId/storage-connectors/',
              )}
              onClick={handleNavigate('/import-sample')}
            >
              Import Sample Data
            </Button>
          </NoData>
        </Flex>
      );
    }
    return (
      <Box mx="-20px" sx={styles}>
        <Row
          middleColumn={2}
          groupComponents={groupComponents as ComponentType<any>[][]}
          groupProps={groupProps}
        />
      </Box>
    );
  };

  return (
    <Card mb="40px" title="Storage connectors" contentProps={contentProps}>
      <Flex justifyContent="space-between" alignItems="center" pb="15px">
        {selectFSOpts.length > 1 && (
          <Select
            mx="8px"
            width="auto"
            listWidth="max-content"
            placeholder="feature store"
            value={selectedFs}
            options={selectFSOpts}
            onChange={setSelectedFs}
          />
        )}
        {!isLoading && data?.length > 0 && <Text>{cardText}</Text>}
        {!isLoading && (
          <Tooltip
            mainText="You have no edit right on the feature store"
            disabled={canEdit && !isPermissionsLoading}
          >
            <Button
              href={getHref('/storage-connectors/new', 'p/:id/fs/:fsId/*')}
              onClick={handleCreate}
              disabled={!canEdit || isPermissionsLoading}
            >
              Set up new storage connector
            </Button>
          </Tooltip>
        )}
      </Flex>
      <CardContent />
    </Card>
  );
};

export default StorageConnectorListContent;

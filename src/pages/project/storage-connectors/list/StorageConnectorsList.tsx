import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@logicalclocks/quartz/dist';

// Components
import StorageConnectorListContent from './StorageConnectorListContent';
import Loader from '../../../../components/loader/Loader';
import NoData from '../../../../components/no-data/NoData';
// Hooks
import useStorageConnectorsData from './useStorageConnectorsData';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import useTitle from '../../../../hooks/useTitle';
import titles from '../../../../sources/titles';
import useGetHrefForRoute from '../../../../hooks/useGetHrefForRoute';

const StorageConnectorsList: FC = () => {
  useTitle(titles.storageConnectors);

  const { id } = useParams();
  const navigate = useNavigateRelative();

  const { data, isLoading } = useStorageConnectorsData(+id);

  const handleNavigate = (to: string) => () => {
    navigate(to, 'p/:id/storage-connectors/');
  };

  const getHref = useGetHrefForRoute();

  if (isLoading) {
    return <Loader />;
  }

  if (!data.length) {
    return (
      <NoData
        mainText="No storage connector setted up"
        secondaryText="Define your storage connector to let Hopsworks go through it and import feature groups"
      >
        <Button
          href={getHref('/new', 'p/:id/storage-connectors/')}
          intent="secondary"
          onClick={handleNavigate('/new')}
        >
          Set up a storage connector
        </Button>
        <Button
          ml="20px"
          intent="primary"
          href={getHref('/import-sample', 'p/:id/storage-connectors/')}
          onClick={handleNavigate('/import-sample')}
        >
          Import Sample Data
        </Button>
      </NoData>
    );
  }

  return <StorageConnectorListContent data={data} />;
};

export default StorageConnectorsList;

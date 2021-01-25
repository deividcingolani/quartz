import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@logicalclocks/quartz/dist';

// Components
import SourceListContent from './SourceListContent';
import Loader from '../../../../components/loader/Loader';
import NoData from '../../../../components/no-data/NoData';
// Hooks
import useSourcesData from './useSourcesData';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import useTitle from '../../../../hooks/useTitle';
import titles from '../../../../sources/titles';

const SourcesList: FC = () => {
  useTitle(titles.storageConnectors);

  const { id } = useParams();
  const navigate = useNavigateRelative();

  const { data, isLoading } = useSourcesData(+id);

  const handleNavigate = (to: string) => () => {
    navigate(to, 'p/:id/storage-conectors/');
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!data.length) {
    return (
      <NoData
        mainText="No storage connector setted up"
        secondaryText="Define your storage connector to let Hopsworks go through it and import feature groups"
      >
        <Button intent="secondary" onClick={handleNavigate('/new')}>
          Set up a storage connector
        </Button>
        <Button
          ml="20px"
          intent="primary"
          onClick={handleNavigate('/import-sample')}
        >
          Import Sample Data
        </Button>
      </NoData>
    );
  }

  return <SourceListContent data={data} />;
};

export default SourcesList;

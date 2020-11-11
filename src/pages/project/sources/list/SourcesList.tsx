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

const SourcesList: FC = () => {
  const { id } = useParams();
  const navigate = useNavigateRelative();

  const { data, isLoading } = useSourcesData(+id);

  const handleNavigate = (to: string) => () => {
    navigate(to, 'p/:id/sources/');
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!data.length) {
    return (
      <NoData
        mainText="No source setted up"
        secondaryText="Define your sources to let Hopsworks go through it and import feature groups"
      >
        <Button intent="secondary" onClick={handleNavigate('/new/aws')}>
          Import from AWS S3
        </Button>
        <Button
          ml="20px"
          intent="secondary"
          onClick={handleNavigate('/new/jdbc')}
        >
          Import from JDBC (Redshift)
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

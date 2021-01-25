import { Flex } from 'rebass';
import React, { FC } from 'react';
import { Button, Text } from '@logicalclocks/quartz';

// Hooks
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import useTitle from '../../../../hooks/useTitle';
import titles from '../../../../sources/titles';

const SourcesImportSample: FC = () => {
  const navigate = useNavigateRelative();

  useTitle(titles.importSample);

  const handleSubmitImport = () => {
    console.log('Import sample');
  };

  return (
    <Flex my="auto" flexDirection="column" alignItems="center">
      <Text>
        Import sample data is a quick way to import dummy data and quickly start
        experimenting with the Feature Store.
      </Text>
      <Flex mt="20px">
        <Button
          onClick={() => navigate('/sources', 'p/:id/*')}
          intent="secondary"
        >
          Use another method
        </Button>
        <Button ml="13px" onClick={handleSubmitImport}>
          Confirm Import
        </Button>
      </Flex>
    </Flex>
  );
};

export default SourcesImportSample;

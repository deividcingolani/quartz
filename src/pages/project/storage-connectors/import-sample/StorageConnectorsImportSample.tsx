// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC } from 'react';
import { Flex } from 'rebass';
import { Button, Text } from '@logicalclocks/quartz';

import { useNavigate, useParams } from 'react-router-dom';
import useTitle from '../../../../hooks/useTitle';
import titles from '../../../../sources/titles';
import getHrefNoMatching from '../../../../utils/getHrefNoMatching';
import routeNames from '../../../../routes/routeNames';

const StorageConnectorsImportSample: FC = () => {
  const navigate = useNavigate();
  const { id, fsId } = useParams();

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
          onClick={() =>
            navigate(
              getHrefNoMatching(
                routeNames.storageConnector.list,
                routeNames.project.value,
                true,
                { id, fsId },
              ),
            )
          }
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

export default StorageConnectorsImportSample;

// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { ComponentType, FC, memo, useEffect } from 'react';
import { Box, Flex } from 'rebass';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Card,
  Labeling,
  Row as QRow,
  Value,
} from '@logicalclocks/quartz';

// Selectors
import {
  selectApiKeys,
  selectApiKeysLoading,
} from '../../../../../store/models/api/api.selectors';
import { selectScopes } from '../../../../../store/models/scope/scope.selectors';
// Components
import Loader from '../../../../../components/loader/Loader';
// Styles
import apiKeysListStyles from './apiKeysListStyles';
// Types
import { Dispatch } from '../../../../../store';
// Hooks
import useApiListRowsData from './useApiListRowsData';
import useTitle from '../../../../../hooks/useTitle';
import titles from '../../../../../sources/titles';

const Row = memo(QRow);

const ApiList: FC = () => {
  const dispatch = useDispatch<Dispatch>();

  const scope = useSelector(selectScopes);
  const apiKeys = useSelector(selectApiKeys).sort((keyA, keyB) =>
    keyA.name.localeCompare(keyB.name),
  );

  useTitle(titles.api);

  const navigate = useNavigate();

  const isLoading = useSelector(selectApiKeysLoading);

  const [groupComponents, groupProps] = useApiListRowsData(apiKeys, scope);

  useEffect(() => {
    dispatch.api.fetch();
    dispatch.scope.fetch();
  }, [dispatch]);

  if (isLoading) {
    return <Loader />;
  }

  if (!apiKeys.length) {
    return (
      <Card
        title="API keys"
        actions={
          <Button
            onClick={() =>
              window.open(
                'https://docs.hopsworks.ai/latest/integrations/databricks/api_key/',
                '_blank',
              )
            }
            p={0}
            intent="inline"
          >
            documentation↗
          </Button>
        }
      >
        <Flex mb="25x">
          <Flex width="100%">
            <Value primary>0</Value>
            <Value ml="5px">API keys</Value>
          </Flex>
          <Button minWidth="105px" onClick={() => navigate('/account/api/new')}>
            New API key
          </Button>
        </Flex>
        <Box mt="20px" mx="-20px">
          <Flex height="50px" mt="30px" justifyContent="center">
            <Labeling fontSize="18px" gray>
              No API keys defined
            </Labeling>
          </Flex>
        </Box>
      </Card>
    );
  }

  return (
    <>
      <Card
        width="1000px"
        title="API keys"
        contentProps={{ pb: 0, overflow: 'visible' }}
        actions={
          <Button
            onClick={() =>
              window.open(
                'https://docs.hopsworks.ai/latest/integrations/databricks/api_key/',
                '_blank',
              )
            }
            p={0}
            intent="inline"
          >
            documentation↗
          </Button>
        }
      >
        <Flex mb="25x">
          <Flex width="100%">
            <Value primary>{apiKeys.length}</Value>
            <Value ml="5px">
              {apiKeys.length > 1 ? ' API keys' : ' API key'}
            </Value>
          </Flex>
          <Button minWidth="105px" onClick={() => navigate('/account/api/new')}>
            New API key
          </Button>
        </Flex>
        <Box mt="20px" mx="-20px" sx={apiKeysListStyles}>
          <Row
            legend={[
              'name',
              'scope',
              'API key prefix',
              'creation',
              'modification',
            ]}
            middleColumn={1}
            groupComponents={groupComponents as ComponentType<any>[][]}
            groupProps={groupProps}
          />
        </Box>
      </Card>
      <Box
        sx={{
          height: '20px',
          width: '100%',
          backgroundColor: '#F5F5F5',
          opacity: 0,
        }}
      >
        invisible block margin
      </Box>
    </>
  );
};

export default ApiList;

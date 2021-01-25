import { Box, Flex } from 'rebass';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { ComponentType, FC, memo, useEffect } from 'react';
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

const Row = memo(QRow);

const ApiList: FC = () => {
  const dispatch = useDispatch<Dispatch>();

  const scope = useSelector(selectScopes);
  const apiKeys = useSelector(selectApiKeys).sort((keyA, keyB) =>
    keyA.name.localeCompare(keyB.name),
  );

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
      <Card title="API keys">
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
    <Card
      width="1000px"
      title="API keys"
      contentProps={{ pb: 0, overflow: 'visible' }}
    >
      <Flex mb="25x">
        <Flex width="100%">
          <Value primary>{apiKeys.length}</Value>
          <Value ml="5px">{3 > 1 ? ' API keys' : ' API key'}</Value>
        </Flex>
        <Button minWidth="105px" onClick={() => navigate('/account/api/new')}>
          New API key
        </Button>
      </Flex>
      <Box mt="20px" mx="-20px" sx={apiKeysListStyles}>
        <Row
          legend={['name', 'scope', 'prefix', 'creation', 'modification']}
          middleColumn={1}
          groupComponents={groupComponents as ComponentType<any>[][]}
          groupProps={groupProps}
        />
      </Box>
    </Card>
  );
};

export default ApiList;

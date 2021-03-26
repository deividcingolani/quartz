import { Button } from '@logicalclocks/quartz';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import React, { FC, useCallback, useEffect } from 'react';

// Types
import { Dispatch } from '../../../../store';
// Components
import ApiForm, { APIFormData } from './ApiForm';
// Selectors
import {
  selectApiKeys,
  selectApiKeysEditLoading,
  selectApiKeysLoading,
} from '../../../../store/models/api/api.selectors';
import { selectScopesLoading } from '../../../../store/models/scope/scope.selectors';

import routeNames from '../../../../routes/routeNames';
import Loader from '../../../../components/loader/Loader';

const ApiEdit: FC = () => {
  const { name: keyName } = useParams();

  const isScopesLoading = useSelector(selectScopesLoading);

  const isSubmit = useSelector(selectApiKeysEditLoading);
  const isApiLoading = useSelector(selectApiKeysLoading);

  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();

  const apiKeys = useSelector(selectApiKeys);

  const data = apiKeys.find(({ name }) => name === keyName);

  useEffect(() => {
    dispatch.api.fetch();
    dispatch.scope.fetch();
    return () => {
      dispatch.api.clear();
    };
  }, [dispatch]);

  const handleSubmit = useCallback(
    async (data: APIFormData) => {
      await dispatch.api.edit({ data });

      navigate(routeNames.account.api.list);
    },
    [dispatch, navigate],
  );

  if (isScopesLoading || isApiLoading || !data) {
    return <Loader />;
  }

  return (
    <>
      <Button
        mb="15px"
        ml="-12px"
        intent="inline"
        alignSelf="flex-start"
        onClick={() => navigate(routeNames.account.api.list)}
      >
        &#8701; all API keys
      </Button>
      <ApiForm
        isEdit={true}
        initialData={data}
        isLoading={isSubmit}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default ApiEdit;

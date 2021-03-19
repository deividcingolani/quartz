import { Box } from 'rebass';
import {
  Code,
  Button,
  Callout,
  usePopup,
  TinyPopup,
  CalloutTypes,
} from '@logicalclocks/quartz';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { FC, useCallback, useEffect, useState } from 'react';

// Selectors
import { selectApiKeysCreateLoading } from '../../../../store/models/api/api.selectors';
import { selectScopesLoading } from '../../../../store/models/scope/scope.selectors';
// Components
import ApiForm, { APIFormData } from './ApiForm';
import Loader from '../../../../components/loader/Loader';

// Types
import { Dispatch } from '../../../../store';

import routeNames from '../../../../routes/routeNames';

const ApiCreate: FC = () => {
  const isSubmit = useSelector(selectApiKeysCreateLoading);
  const isScopesLoading = useSelector(selectScopesLoading);

  const [createdKey, setKey] = useState('');

  const [isPopupOpen, handleToggle] = usePopup();

  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch.scope.fetch();
    return () => {
      dispatch.api.clear();
    };
  }, [dispatch]);

  const handleSubmit = useCallback(
    async (data: APIFormData) => {
      const { data: createdData } = await dispatch.api.create({ data });

      if (createdData?.key) {
        setKey(createdData.key);
        handleToggle();
      }
    },
    [dispatch, handleToggle],
  );

  if (isScopesLoading) {
    return <Loader />;
  }

  return (
    <>
      <TinyPopup
        width="440px"
        title="Save the key"
        isOpen={isPopupOpen}
        onClose={handleToggle}
        closeOnBackdropClick={false}
        secondaryText="Your APi key has been generated."
        secondaryButton={[
          'I saved the APi key',
          () => navigate(routeNames.account.api.list),
        ]}
      >
        <Box
          m="-20px"
          sx={{
            wordBreak: 'break-all',
          }}
        >
          <Code copyButton content={createdKey} title="API key" />
        </Box>
        <Box my="20px">
          <Callout
            content="Save this API key preciously. It won’t be accessible afterwards"
            type={CalloutTypes.warning}
          />
        </Box>
      </TinyPopup>
      <Button
        mb="15px"
        ml="-12px"
        intent="inline"
        alignSelf="flex-start"
        onClick={() => navigate(routeNames.account.api.list)}
      >
        &#8701; all APi keys
      </Button>
      <ApiForm isLoading={isSubmit} onSubmit={handleSubmit} />
    </>
  );
};

export default ApiCreate;

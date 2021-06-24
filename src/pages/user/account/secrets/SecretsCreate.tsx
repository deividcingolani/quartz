// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback } from 'react';
import { Button } from '@logicalclocks/quartz';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Selectors
import { selectSecretsCreateLoading } from '../../../../store/models/secrets/secrets.selectors';
// Components
import SecretsForm, { SecretsFormData } from './SecretsForm';
// Types
import { Dispatch } from '../../../../store';

import routeNames from '../../../../routes/routeNames';
import { SecretsVisibility } from '../../../../types/secrets';
import useTitle from '../../../../hooks/useTitle';
import titles from '../../../../sources/titles';

const SecretsCreate: FC = () => {
  const isCreationLoading = useSelector(selectSecretsCreateLoading);

  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();

  useTitle(titles.createSecret);

  const handleSubmit = useCallback(
    async ({ name, secret, visibility, project }: SecretsFormData) => {
      const data = {
        name,
        secret,
        visibility: visibility.toUpperCase(),
        ...(visibility === SecretsVisibility.project && {
          scope: project,
        }),
      } as SecretsFormData;

      await dispatch.secrets.create({ data });
      navigate(routeNames.account.secrets.list);
    },
    [dispatch.secrets, navigate],
  );

  return (
    <>
      <Button
        mb="15px"
        ml="-12px"
        intent="inline"
        alignSelf="flex-start"
        onClick={() => navigate(routeNames.account.secrets.list)}
      >
        &#8701; all secrets
      </Button>
      <SecretsForm isLoading={isCreationLoading} onSubmit={handleSubmit} />
    </>
  );
};

export default SecretsCreate;

// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, useCallback, useEffect, useState } from 'react';
// Components
import {
  Labeling,
  Input,
  Button,
  Callout,
  CalloutTypes,
  Select,
  ToggleButton,
} from '@logicalclocks/quartz';
import { Box, Flex } from 'rebass';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Dispatch } from '../../../../../store';
import getInputValidation from '../../../../../utils/getInputValidation';
import {
  selectSecrets,
  selectSecretsListLoading,
} from '../../../../../store/models/secrets/secrets.selectors';
import { Secret } from '../../../../../types/secrets';

interface GitFormProps {
  setInstallCount: (arg: number) => void;
  installCount: number;
  setIsRequesting: (arg: boolean) => void;
  isRequesting: boolean;
  postInstallationCheck: (arg: number) => void;
}

const GitForm: FC<GitFormProps> = ({
  isRequesting,
  setIsRequesting,
  postInstallationCheck,
}) => {
  const [url, setUrl] = useState<string>('');
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [selectedSecret, setSelectedSecret] = useState<string>('');
  const dispatch = useDispatch<Dispatch>();
  const { id: projectId, version } = useParams();

  const isSecretsLoading = useSelector(selectSecretsListLoading);
  const secrets: Secret[] = useSelector(selectSecrets);

  const reg = RegExp(`(?:git@|https://)github.com[:/](.*)[/](.*)[:.git]?`);

  const schema = yup.object().shape({
    url: yup
      .string()
      .test(`${url}`, 'Url is required', () => {
        return url !== '';
      })
      .trim()
      .matches(reg, 'Wrong format'),
    secret: yup.string(),
  });

  const methods = useForm({
    defaultValues: {
      ...{
        url: '',
      },
    },
    resolver: yupResolver(schema),
  });

  const { errors, handleSubmit, clearErrors, register } = methods;

  useEffect(() => {
    clearErrors('url');
  }, [clearErrors, url]);

  useEffect(() => {
    dispatch.secrets.fetchAll();
  }, [dispatch]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleCreate = useCallback(
    handleSubmit(async () => {
      const repoName = reg.exec(url)![2];

      const data = {
        library: repoName,
        dependencyUrl: url,
        channelUrl: 'git',
        packageSource: 'GIT',
      };

      setIsRequesting(true);
      dispatch.pythonLibrary
        .installLibrary({
          id: +projectId,
          version,
          name: repoName,
          data: isPrivate
            ? { ...data, gitApiKey: selectedSecret, gitBackend: 'GITHUB' }
            : data,
        })
        .then(() => {
          postInstallationCheck(1000);
          dispatch.pythonLibrary
            .getLibrariesWithOperations({
              id: +projectId,
              version,
            })
            .then(() => {
              setIsRequesting(false);
            });
        })
        .catch(() => {
          setIsRequesting(false);
        });
    }),
    [
      postInstallationCheck,
      url,
      reg,
      selectedSecret,
      isPrivate,
      setIsRequesting,
      projectId,
      version,
      dispatch.pythonLibrary,
    ],
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleCreate}>
        <Flex flexDirection="column">
          <Labeling bold mb="8px">
            Git URL
          </Labeling>
          <Input
            name="url"
            ref={register}
            {...getInputValidation('url', errors)}
            placeholder="https://github.com/organization/repository.git"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            width="100%"
          />

          <ToggleButton
            checked={isPrivate}
            onChange={() => setIsPrivate(!isPrivate)}
            my="20px"
          >
            Private URL
          </ToggleButton>

          {isPrivate && (
            <Box mb="20px" width="100%">
              <Callout
                width="100%"
                type={CalloutTypes.neutral}
                content="This repository is hidden. It is probably private repository, pick an API key from your secrets"
              />

              <Flex flexDirection="column" mt="20px">
                <Select
                  {...getInputValidation('secret', errors)}
                  mb="20px"
                  width="100%"
                  value={[selectedSecret]}
                  listWidth="100%"
                  hasPlaceholder={selectedSecret === ''}
                  placeholder="pick an API key"
                  label="Secret as API Key"
                  options={
                    isSecretsLoading ? [] : secrets.map((secret) => secret.name)
                  }
                  onChange={(val: string[]) => {
                    setSelectedSecret(val[0]);
                  }}
                />
              </Flex>
            </Box>
          )}
          <Box display="flex" ml="auto">
            <Button ml="8px" type="submit" disabled={isRequesting}>
              Run installation
            </Button>
          </Box>
        </Flex>
      </form>
    </FormProvider>
  );
};

export default memo(GitForm);

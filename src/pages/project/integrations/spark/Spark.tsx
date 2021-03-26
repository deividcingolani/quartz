import * as yup from 'yup';
import { Box, Flex } from 'rebass';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  Card,
  Code,
  Input,
  Value,
  Button,
  Callout,
  Labeling,
  usePopup,
  TinyPopup,
  CalloutTypes,
} from '@logicalclocks/quartz';

import Loader from '../../../../components/loader/Loader';

import { shortRequiredText } from '../../../../utils/validators';
import getInputValidation from '../../../../utils/getInputValidation';

import BaseApiService, {
  RequestType,
} from '../../../../services/BaseApiService';

import useTitle from '../../../../hooks/useTitle';
import titles from '../../../../sources/titles';

export const schema = yup.object().shape({
  password: shortRequiredText.label('Password'),
});

interface CertificateState {
  kStore: string;
  tStore: string;
  password: string;
}

function download(filename: string, text: string) {
  const element = document.createElement('a');
  element.setAttribute(
    'href',
    `data:multipart/form-data;charset=utf-8,${encodeURIComponent(text)}`,
  );
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

const Spark: FC = () => {
  const { id } = useParams();

  useTitle(titles.spark);

  const [token, setToken] = useState<string>();
  const [configurations, setConfigurations] = useState<string[]>([]);
  const [certificate, setCertificate] = useState<CertificateState>();

  const [isPopupOpen, handleToggle] = usePopup();
  const [isDownloadOpen, handleToggleDownload] = usePopup();

  const { errors, register, handleSubmit, setError } = useForm({
    shouldUnregister: false,
    resolver: yupResolver(schema),
  });

  const loadConfiguration = useCallback(async () => {
    const {
      data: { items },
    } = await new BaseApiService().request<{
      items: { propertyName: string; propertyValue: string }[];
    }>({
      url: `project/${id}/integrations/spark/client/configuration`,
      type: RequestType.get,
    });

    if (items) {
      setConfigurations(
        items.map(
          ({ propertyName, propertyValue }) =>
            `${propertyName} ${propertyValue}`,
        ),
      );
    }
  }, [id]);

  const loadToken = useCallback(async () => {
    const {
      data: {
        data: { value: serverToken },
      },
    } = await new BaseApiService().request<{
      data: { value: string };
    }>({
      url: `project/${id}/integrations/spark/client/token`,
      type: RequestType.get,
    });

    if (serverToken) {
      setToken(serverToken);
    }
  }, [id]);

  useEffect(() => {
    loadConfiguration();
    loadToken();
  }, [id, loadToken, loadConfiguration]);

  const onDownloadPassword = useCallback(() => {
    if (certificate?.password) {
      download('material_passwd', certificate.password);
    }
  }, [certificate]);

  const onDownloadCertificates = useCallback(() => {
    if (certificate?.kStore && certificate?.tStore) {
      download('keyStore.jks', certificate.kStore);
      download('trustStore.jks', certificate.tStore);
    }
  }, [certificate]);

  const onSubmit = useCallback(
    handleSubmit(async ({ password }) => {
      await new BaseApiService()
        .request<CertificateState>({
          url: `project/${id}/downloadCert`,
          type: RequestType.post,
          headers: {},
          data: new URLSearchParams({ password }).toString(),
        })
        .then(({ data }) => {
          setCertificate(data);

          download('keyStore.jks', data.kStore);
          download('trustStore.jks', data.tStore);

          handleToggle();
          handleToggleDownload();
        })
        .catch(() => {
          setError('password', { message: 'wrong password' });
        });
    }),
    [],
  );

  const handleDownloadJars = useCallback(() => {
    window.open(
      `${process.env.REACT_APP_API_HOST}/project/${id}/integrations/spark/client/download?token=${token}`,
      '_blank',
    );

    setToken('');

    loadToken();
  }, [id, token, loadToken]);

  if (!configurations.length) {
    return <Loader />;
  }

  return (
    <>
      <TinyPopup
        secondaryText=""
        isOpen={isPopupOpen}
        title="Download certificate and its password"
        onClose={handleToggle}
        mainButton={['Authenticate', onSubmit]}
        secondaryButton={['Back', handleToggle]}
      >
        <Box mb="20px">
          <Box>
            <Callout
              content="Enter your user password to verify your account"
              type={CalloutTypes.neutral}
            />
          </Box>
          <Input
            width="100%"
            type="password"
            name="password"
            labelProps={{
              mt: '20px',
            }}
            ref={register}
            label="Password"
            {...getInputValidation('password', errors)}
            placeholder="••••••"
          />
        </Box>
      </TinyPopup>

      <TinyPopup
        width="440px"
        secondaryText=""
        isOpen={isDownloadOpen}
        closeOnBackdropClick={false}
        title="Download certificates and password"
        onClose={handleToggleDownload}
        secondaryButton={['Done', handleToggleDownload]}
      >
        <Box mb="20px">
          <Value mb="8px">1. Certificates</Value>
          <Flex flexDirection="column">
            <Flex>
              <Labeling
                sx={{
                  whiteSpace: 'nowrap',
                }}
              >
                The certificates has been downloaded. Otherwise
              </Labeling>
              <Button
                my="-8px"
                mx="-12px"
                sx={{
                  whiteSpace: 'nowrap',
                  fontWeight: 'bold',
                  fontSize: '12px',
                }}
                intent="inline"
                onClick={onDownloadCertificates}
              >
                click here
              </Button>
              <Labeling
                sx={{
                  whiteSpace: 'nowrap',
                }}
              >
                to try
              </Labeling>
            </Flex>
            <Labeling
              sx={{
                whiteSpace: 'nowrap',
              }}
            >
              again. Then, add them as local resources to your Spark job.
            </Labeling>
          </Flex>

          <Flex flexDirection="column" mt="20px">
            <Value mb="8px">2. Certificate password</Value>
            <Flex>
              <Labeling>Save the certificate password in a file named</Labeling>
              <Value mx="3px">material_passwd</Value>
              <Labeling>and</Labeling>
            </Flex>
            <Flex>
              <Labeling>add it as local resource as well. You can</Labeling>
              <Button
                my="-8px"
                mx="-12px"
                sx={{
                  whiteSpace: 'nowrap',
                  fontWeight: 'bold',
                  fontSize: '12px',
                }}
                intent="inline"
                onClick={onDownloadPassword}
              >
                click here
              </Button>
              <Labeling>to directly</Labeling>
            </Flex>
            <Labeling>download a file containing the password.</Labeling>
          </Flex>

          <Box m="-20px" mt="20px">
            <Code
              isColorSyntax={false}
              copyButton
              content={certificate?.password || ''}
            />
          </Box>
        </Box>
      </TinyPopup>

      <Card
        mb="40px"
        title="Configure Spark integration"
        actions={
          <Button
            onClick={() =>
              window.open(
                'https://docs.hopsworks.ai/integrations/spark',
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
        <Labeling>
          This page walks you through the steps to configure an external Spark
          cluster to be able to interact with the Hopsworks Feature Store.
        </Labeling>

        <Flex width="100%" flexDirection="column" mt="20px">
          <Flex>
            <Value minWidth="200px">1. Download client jars</Value>
            <Flex flexDirection="column">
              <Labeling>
                Extract the jars from the archive and add them as local
                resources to your Spark Job
              </Labeling>
              <Button
                mt="10px"
                disabled={!token}
                width="fit-content"
                onClick={handleDownloadJars}
              >
                Download jars
              </Button>
            </Flex>
          </Flex>

          <Flex mt="20px">
            <Value minWidth="200px">2. Download certificates</Value>
            <Flex flexDirection="column">
              <Flex>
                <Labeling>
                  Download the certificates and add them as local resources to
                  your Spark job. Save the password in a file named
                </Labeling>
                <Labeling
                  sx={{
                    fontWeight: 700,
                    minWidth: 'auto',
                  }}
                  mx="3px"
                >
                  material_passwd
                </Labeling>
                <Labeling>and add it as local resource.</Labeling>
              </Flex>
              <Button mt="10px" width="fit-content" onClick={handleToggle}>
                Download certificates
              </Button>
            </Flex>
          </Flex>

          <Flex mt="20px">
            <Value minWidth="200px">3. Configure Spark</Value>
            <Box width="100%" m="-20px">
              <Code
                title="Spark configuration"
                isColorSyntax
                copyButton
                content={configurations.join('\n')}
              />
            </Box>
          </Flex>
        </Flex>
      </Card>
    </>
  );
};

export default Spark;

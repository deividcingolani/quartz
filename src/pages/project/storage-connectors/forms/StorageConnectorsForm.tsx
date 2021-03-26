import Yup from 'yup';
import { Box, Flex } from 'rebass';
import {
  Card,
  Label,
  Button,
  Callout,
  RadioGroup,
  CalloutTypes,
  StickySummary,
  Input,
  Tooltip,
  Icon,
  Divider,
  TooltipPositions,
  Value,
  Microlabeling,
} from '@logicalclocks/quartz';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
// Default validators
import * as yup from 'yup';
import { name, shortText } from '../../../../utils/validators';
// Routes
import routeNames from '../../../../routes/routeNames';
// Types
import { StorageConnectorProtocol } from '../types';
import { DescriptionsData, StorageConnectorsFormData } from './types';
import { EffectError } from '../../../../store/plugins/errors.plugin';
import { FeatureStoreStorageConnector } from '../../../../types/feature-store';
// Components
import Loader from '../../../../components/loader/Loader';
// Styles
import formStyles from './form.styles';
// Utils
import {
  cropText,
  formatStringToArguments,
  getDescription,
  getForm,
  getSchema,
  protocolOptions,
  protocolVisualOptions,
} from '../utils';
import getInputValidation from '../../../../utils/getInputValidation';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import { selectFeatureStoreData } from '../../../../store/models/feature/selectors';
import featureStoreService from '../../../../services/project/FeatureStoresService';
import useScreenWithScroll from '../../../../hooks/useScreenWithScroll';

export interface StorageConnectorsCreateFormProps {
  error?: EffectError<{ errorMsg: string }>;
  initialProtocol?: StorageConnectorProtocol;
  isLoading: boolean;
  isDisabled: boolean;
  onSubmit: (data: StorageConnectorsFormData) => void;
  onDelete?: () => void;
  isEdit?: boolean;
  initialData?: FeatureStoreStorageConnector;
}

export const commonSchema = yup.object().shape({
  description: shortText.label('Description'),
  name: name.label('Name'),
});

const StorageConnectorsForm: FC<StorageConnectorsCreateFormProps> = ({
  error,
  initialProtocol = StorageConnectorProtocol.aws,
  isLoading,
  isDisabled,
  onSubmit,
  onDelete,
  isEdit,
  initialData,
}) => {
  const navigate = useNavigateRelative();

  const getSchemaByProtocol = useMemo(() => getSchema(commonSchema), []);

  const [schema, setSchema] = useState<Yup.ObjectSchema>(
    getSchemaByProtocol(initialProtocol),
  );

  const {
    watch,
    control,
    errors,
    register,
    unregister,
    setValue,
    clearErrors,
    handleSubmit,
    reset,
    setError,
  } = useForm({
    defaultValues: {
      protocol: initialProtocol,
      bucket: '',
      connectionString: '',
      datasetName: '',
      clusterIdentifier: '',
      ...initialData,
      ...(initialData?.arguments
        ? { arguments: formatStringToArguments(initialData.arguments) }
        : {}),
    } as StorageConnectorsFormData,
    shouldUnregister: false,
    resolver: yupResolver(schema),
  });

  const errorsValue =
    Object.keys(errors).length === 1
      ? `${Object.keys(errors).length.toString()} error`
      : Object.keys(errors).length !== 0
      ? `${Object.keys(errors).length.toString()} errors`
      : '';

  const { name: storageName, protocol, ...descriptions } = watch([
    'name',
    'protocol',
    'bucket', // Footer description for AWS
    'connectionString', // Footer description for JDBC
    'datasetName', // Footer description for HopsFS
    'clusterIdentifier', // Footer description for Redshift
    'directoryId', // Footer description for Azure
  ]);

  const { id: projectId } = useParams();

  const description = useMemo(() => {
    const desc = descriptions as DescriptionsData;
    return getDescription(desc, protocol);
  }, [descriptions, protocol]);

  const Form = useMemo(() => getForm(protocol), [protocol]);
  const { data: featureStoreData } = useSelector(selectFeatureStoreData);

  useEffect(() => {
    clearErrors();
    setSchema(getSchemaByProtocol(protocol));
  }, [protocol, setValue, clearErrors, isEdit, getSchemaByProtocol]);

  useEffect(() => {
    // Unregister name validation when disabled.
    if (isEdit) unregister('name');
  });

  const hasScrollOnScreen = useScreenWithScroll();

  const isValidName = useCallback(async () => {
    if (featureStoreData?.featurestoreId && projectId) {
      const { data } = await featureStoreService.getStorageConnectors(
        +projectId,
        featureStoreData?.featurestoreId,
      );
      return data.findIndex((x) => x.name === storageName) === -1;
    }
  }, [featureStoreData, projectId, storageName]);

  const handleSubmitWithNameValidation = async () => {
    if (isEdit || (await isValidName())) {
      handleSubmit(onSubmit)();
    } else {
      setError('name', { message: 'This name is already in use' });
    }
  };

  return (
    <>
      <Card
        title={isEdit ? 'Edit storage connector' : 'Set up storage connector'}
        contentProps={{ overflow: 'visible' }}
        mb="100px"
      >
        <Flex sx={formStyles} flexDirection="column">
          {/* API Error Messages */}
          {error && (
            <Callout
              type={CalloutTypes.error}
              content="Can’t connect to the server. Check your URL and credentials."
            />
          )}
          {/* Name and Description */}
          {isEdit && !!initialData && (
            <Flex>
              <Box mr="20px">
                <Microlabeling gray>Name</Microlabeling>
                <Value mt="4px" primary>
                  {initialData.name}
                </Value>
              </Box>
              <Box>
                <Microlabeling gray>Protocol</Microlabeling>
                <Value mt="4px" primary>
                  {protocolVisualOptions.getByKey(
                    protocolOptions.getByValue(
                      initialData.storageConnectorType,
                    ) as StorageConnectorProtocol,
                  )}
                </Value>
              </Box>
            </Flex>
          )}
          <Flex mb="20px">
            {!isEdit && (
              <Input
                label="Name"
                name="name"
                disabled={isLoading || isDisabled || isEdit}
                placeholder="name of the source"
                ref={register}
                labelAction={
                  !isEdit && (
                    <Tooltip
                      position={TooltipPositions.right}
                      mainText="Only alphanumeric characters, dash or underscore"
                      ml="5px"
                    >
                      <Icon icon="info-circle" />
                    </Tooltip>
                  )
                }
                {...getInputValidation('name', errors)}
              />
            )}
            <Input
              labelProps={{
                flexGrow: 1,
                mt: isEdit ? '20px' : 0,
                marginLeft: !isEdit ? '20px' : 0,
              }}
              label="Description"
              name="description"
              optional={true}
              disabled={isLoading || isDisabled}
              placeholder="description"
              ref={register}
              {...getInputValidation('description', errors)}
            />
          </Flex>

          {/* Protocol Radio control */}
          {!isEdit && (
            <Box>
              <Label mt={0} mb="8px">
                Protocol
              </Label>
              <Controller
                control={control}
                name="protocol"
                render={({ onChange, value }) => (
                  <RadioGroup
                    flexDirection="row"
                    mr="30px"
                    disabled={isEdit || isLoading}
                    value={protocolVisualOptions.getByKey(value)}
                    options={protocolVisualOptions.labels}
                    onChange={(val) => {
                      reset(); // reset values from previous protocol
                      onChange(protocolVisualOptions.getByValue(val));
                    }}
                  />
                )}
              />
            </Box>
          )}

          <Divider mt={isEdit ? '0' : '20px'} legend="Parameters" />

          {/* Form Section */}
          <Form
            setValue={setValue}
            watch={watch}
            errors={errors}
            key="form"
            register={register}
            control={control}
            isDisabled={isLoading || isDisabled}
          />

          {/* Submit Section */}
          {isEdit && onDelete && (
            <>
              <Divider legend="Danger zone" />
              <Button
                width="fit-content"
                intent="alert"
                disabled={isLoading || isDisabled}
                onClick={onDelete}
              >
                Delete the storage connector
              </Button>
            </>
          )}
        </Flex>
        {isLoading && <Loader />}
      </Card>
      <StickySummary
        title={cropText(storageName, 24)}
        firstValue={cropText(description, 50)}
        errorsValue={errorsValue}
        mainButton={
          <Button
            disabled={isLoading || isDisabled}
            intent="primary"
            onClick={handleSubmitWithNameValidation}
          >
            {isEdit ? 'Save' : 'Setup storage connector'}
          </Button>
        }
        secondaryButton={
          <Button
            type="button"
            disabled={isLoading}
            intent="secondary"
            onClick={() =>
              navigate(
                routeNames.storageConnector.list,
                routeNames.project.view,
              )
            }
          >
            Back
          </Button>
        }
        hasScrollOnScreen={hasScrollOnScreen}
      />
    </>
  );
};

export default memo(StorageConnectorsForm);

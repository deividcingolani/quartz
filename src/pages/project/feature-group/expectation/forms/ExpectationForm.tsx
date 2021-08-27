// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import * as yup from 'yup';
import { Box, Flex } from 'rebass';
import { useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector } from 'react-redux';
import {
  Card,
  Input,
  Label,
  Value,
  Select,
  Button,
  Callout,
  RadioGroup,
  CalloutTypes,
  CardSecondary,
} from '@logicalclocks/quartz';
import { Controller, FormProvider, useForm } from 'react-hook-form';

// Components
import RulesForm from './RulesForm';
import MatchingError from './MatchingError';
import UpdatesForm from './Updates/UpdatesForm';
import Loader from '../../../../../components/loader/Loader';
import ExpectationDetailsForm from './ExpectationDetailsForm';
// Types
import { RootState } from '../../../../../store';
import { ExpectationData, ExpectationType } from '../types';
import { Expectation } from '../../../../../types/expectation';
import { FeatureGroup } from '../../../../../types/feature-group';
// Utils
import { mapRulesToForm, validateRules } from '../utilts';
import getInputValidation from '../../../../../utils/getInputValidation';
import { nameNotRequired, shortText } from '../../../../../utils/validators';
// Selectors
import SelectExistingExpectationForm from './SelectExistingExpectationForm';
import {
  selectExpectationAttachLoading,
  selectExpectations,
} from '../../../../../store/models/expectations/expectations.selectors';
import ExpectationSummary from './ExpectationSummary';

export interface ExpectationFormProps {
  isEdit?: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  onDelete?: () => void;
  onSubmit: (data: any) => void;
  initialData?: Expectation;
}

const schema = yup.object().shape({
  name: nameNotRequired.label('Name'),
  description: shortText.label('Description'),
});

const ExpectationForm: FC<ExpectationFormProps> = ({
  isEdit,
  isDisabled,
  isLoading,
  onDelete,
  onSubmit,
  initialData,
}) => {
  const { from: fromFeatureGroup, fgId } = useParams();

  const [expType, setType] = useState<ExpectationType>(
    ExpectationType.existing,
  );

  const tooltipMessages = {
    [ExpectationType.existing]: 'No expectation defined',
    [ExpectationType.new]: '',
  };

  const methods = useForm({
    defaultValues: {
      name: '',
      description: '',
      expectation: [],
      features: [],
      featureGroups: [],
      ...(!!initialData && {
        name: initialData.name,
        description: initialData.description,
        rules: mapRulesToForm(initialData.rules),
        features: initialData.features,
        featureGroups: initialData.attachedFeatureGroups,
      }),
    },
    shouldUnregister: false,
    resolver: yupResolver(schema),
  });

  const {
    control,
    register,
    watch,
    handleSubmit,
    errors,
    setError,
    getValues,
    setValue,
  } = methods;

  const {
    name,
    features,
    expectation,
    featureGroups: attachedFgs = [],
  } = watch(['expectation', 'featureGroups', 'features', 'name']);

  const featureStoreData = useSelector((state: RootState) =>
    state.featureStores?.length ? state.featureStores[0] : null,
  );

  const featureGroup = useSelector(
    (state: RootState) => state.featureGroupView,
  );

  let errorsValue = '';
  const len = Object.keys(errors).length;
  if (len > 0) {
    errorsValue =
      len === 1 ? `${len.toString()} error` : `${len.toString()} errors`;
  }

  const expectations = useSelector(selectExpectations);

  const isAttaching = useSelector(selectExpectationAttachLoading);

  const featureGroups = useSelector((state: RootState) => state.featureGroups);

  const selectedExpectation = useMemo(
    () => expectations.find(({ name }) => name === expectation[0]),
    [expectation, expectations],
  );

  const allFeatures = useMemo(
    () =>
      Array.from(
        new Set(
          attachedFgs.reduce(
            (acc: string[], { features }) => [
              ...acc,
              ...features.map(({ name }) => name),
            ],
            [],
          ),
        ),
      ),
    [attachedFgs],
  );

  const isMatchingExpectation = useMemo(
    () =>
      selectedExpectation?.features.every((name) =>
        featureGroup?.features.map(({ name }) => name).includes(name),
      ),
    [featureGroup, selectedExpectation],
  );

  const isMatchingExpectationToAttachedFg = useMemo(
    () =>
      features.every((name) =>
        featureGroup?.features.map(({ name }) => name).includes(name),
      ),
    [featureGroup, features],
  );

  const isMatchingFeatureGroups = useMemo(
    () =>
      attachedFgs?.every(({ features: fgFeatures }) =>
        features.every((feature) =>
          fgFeatures.map(({ name }) => name).includes(feature),
        ),
      ),
    [attachedFgs, features],
  );

  const isMatchingFromFg = useMemo(
    () =>
      features.every((feature) =>
        featureGroup?.features.map(({ name }) => name).includes(feature),
      ),
    [featureGroup, features],
  );

  const handleSubmitForm = useCallback(
    (data: ExpectationData) => {
      const { features, rules, name } = data;
      const isExists = !!expectations.find(
        (expectation) => expectation.name === name,
      );

      if (isExists) {
        return;
      }

      if (!features.length && expType === ExpectationType.new) {
        setError('features', {
          message: 'At least one feature name should be selected',
        });
        return;
      }

      if (expType === ExpectationType.new && !name) {
        setError('name', { message: 'Name is required' });
        return;
      }

      if (
        expType === ExpectationType.new &&
        rules.length === 1 &&
        !rules[0].type
      ) {
        setError('rulesForm', {
          message: 'At least one rule should be defined',
        });
        return;
      }

      if (expType === ExpectationType.new && !!rules) {
        const rulesValidateResult = validateRules(rules, features, setError);

        if (!rulesValidateResult.validated) {
          return;
        }
      }

      onSubmit({ ...data, type: expType });
    },
    [onSubmit, setError, expType, expectations],
  );

  const isNameAlreadyExists = useMemo(
    () => expectations.find((expectation) => expectation.name === name),
    [expectations, name],
  );

  const featuresAdditionalTexts = useMemo(() => {
    const names = !fgId
      ? allFeatures
      : featureGroup?.features.map(({ name }) => name) || [];

    return names.sort().map((name) => {
      const fgs = featureGroups.filter(({ features }) =>
        features.map(({ name }) => name).includes(name),
      );
      if (fgs.length === attachedFgs.length) {
        return 'all';
      }
      const attaNames = attachedFgs.map(({ name }) => name);

      return fgs
        .map(({ name }) => name)
        .filter((text) => attaNames.includes(text))
        .slice(0, 6)
        .join(', ');
    });
  }, [fgId, allFeatures, attachedFgs, featureGroup, featureGroups]);

  const onAttachFg = async () => {
    if (featureGroup && featureStoreData?.featurestoreId) {
      const prevAttached = getValues('featureGroups');

      if (
        !prevAttached?.find(({ name }) => featureGroup.name === name) &&
        prevAttached
      ) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setValue('featureGroups', [featureGroup, ...prevAttached]);
      }
    }
  };

  useEffect(() => {
    if (!expectations.length && !isEdit) {
      setType(ExpectationType.new);
    }
  }, [expectations, isEdit]);

  useEffect(() => {
    if (initialData) {
      setType(ExpectationType.new);
    }
  }, [initialData]);

  return (
    <FormProvider {...methods}>
      <Box>
        {!!errors.features && (
          <Box mb="10px">
            <Callout
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              content={errors.features.message}
              type={CalloutTypes.error}
            />
          </Box>
        )}
        <Box mb="100px">
          <Card title={isEdit ? 'Edit expectation' : 'Attach an expectation'}>
            {!isEdit && (
              <>
                <Flex>
                  <Label>Attach an expectation to</Label>
                  <Value primary ml="3px">
                    {featureGroup?.name}
                  </Value>
                </Flex>
                <Box mt="20px" ml="-20px">
                  <RadioGroup
                    ml="20px"
                    value={expType}
                    flexDirection="row"
                    options={Object.values(ExpectationType)}
                    onChange={(value) => setType(value as ExpectationType)}
                    disabled={!expectations.length || isLoading || isDisabled}
                    tooltipMessages={tooltipMessages}
                  />
                </Box>
              </>
            )}

            {expType === ExpectationType.new && (
              <>
                <Flex mt={isEdit ? 0 : '20px'}>
                  <Input
                    name="name"
                    ref={register}
                    placeholder="name"
                    label="Expectation name"
                    disabled={isLoading || isDisabled}
                    {...getInputValidation('name', errors)}
                  />
                  <Input
                    optional={true}
                    ref={register}
                    name="description"
                    label="Description"
                    placeholder="description"
                    disabled={isLoading || isDisabled}
                    {...getInputValidation('description', errors)}
                    labelProps={{
                      flex: 1,
                      ml: '20px',
                    }}
                  />
                </Flex>
                {isNameAlreadyExists && !!fgId && (
                  <Box mt="20px">
                    <Callout
                      content="An expectation already has this name."
                      type={CalloutTypes.warning}
                    />
                  </Box>
                )}
                {!!fromFeatureGroup &&
                  !attachedFgs?.find(({ name }) => name === fromFeatureGroup) &&
                  isEdit &&
                  isMatchingFromFg && (
                    <Box
                      sx={{
                        div: {
                          width: '100%',
                          div: {
                            width: '100%',

                            pre: {
                              width: '100%',
                            },
                            div: {
                              width: 'initial',
                            },
                          },
                        },
                      }}
                      mt="20px"
                    >
                      <Callout
                        type={CalloutTypes.warning}
                        content={
                          <Flex
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Value color="labels.orange">
                              You were attaching this expectation to{' '}
                              {fromFeatureGroup}. Do you still want to attach it
                              to {fromFeatureGroup}?
                            </Value>
                            <Button
                              intent="secondary"
                              onClick={onAttachFg}
                              disabled={isAttaching || isLoading || isDisabled}
                            >
                              Attach {fromFeatureGroup}
                            </Button>
                          </Flex>
                        }
                      />
                    </Box>
                  )}
                {!isEdit && (
                  <Box mt="20px">
                    <Callout
                      content="An expectation can be attached to multiple feature groups containing the same feature names."
                      type={CalloutTypes.neutral}
                    />
                  </Box>
                )}
                {isEdit && (
                  <Controller
                    control={control}
                    name="featureGroups"
                    render={({
                      onChange,
                      value,
                    }: {
                      value: FeatureGroup[];
                      onChange: any;
                    }) => (
                      <Select
                        mt="20px"
                        width="100%"
                        isMulti={true}
                        listWidth="100%"
                        maxListHeight="400px"
                        hasPlaceholder={false}
                        hasSearch={true}
                        label="Attached feature groups"
                        placeholder="pick a feature group"
                        disabled={isLoading || isDisabled}
                        value={value.map(({ name }) => name)}
                        options={featureGroups.map(({ name }) => name)}
                        onChange={(values) =>
                          onChange(
                            values.map((name) =>
                              featureGroups.find(
                                (featureGroup) => featureGroup.name === name,
                              ),
                            ),
                          )
                        }
                      />
                    )}
                  />
                )}
                <Controller
                  control={control}
                  name="features"
                  render={({ onChange, value }) => (
                    <Select
                      mt="20px"
                      width="100%"
                      value={value}
                      isMulti={true}
                      listWidth="100%"
                      label="Features"
                      hasSearch={true}
                      onChange={onChange}
                      maxListHeight="400px"
                      hasPlaceholder={false}
                      needSecondaryText={false}
                      disabled={isLoading || isDisabled}
                      searchPlaceholder="Find a feature..."
                      placeholder="pick concerned features"
                      additionalTexts={featuresAdditionalTexts}
                      options={
                        !fgId
                          ? allFeatures
                          : featureGroup?.features.map(({ name }) => name) || []
                      }
                    />
                  )}
                />

                {!isEdit &&
                  expType === ExpectationType.new &&
                  !isMatchingExpectationToAttachedFg && (
                    <Box mt="20px">
                      <Callout
                        content="Attached feature group does not contain all the selected features."
                        type={CalloutTypes.error}
                      />
                    </Box>
                  )}

                {isEdit && (
                  <MatchingError
                    features={features}
                    featureGroups={attachedFgs || []}
                  />
                )}
              </>
            )}

            {expType === ExpectationType.existing && !isEdit && (
              <SelectExistingExpectationForm />
            )}
          </Card>

          {isEdit && (
            <RulesForm isEdit={isEdit} isDisabled={isLoading || isDisabled} />
          )}
          {expType === ExpectationType.new && !isEdit && (
            <RulesForm isEdit={isEdit} isDisabled={isLoading || isDisabled} />
          )}
          {expType === ExpectationType.existing &&
            !!selectedExpectation &&
            !!featureGroup && (
              <ExpectationDetailsForm
                featureGroup={featureGroup}
                expectation={selectedExpectation}
              />
            )}

          {isEdit && !!onDelete && (
            <CardSecondary mt="20px" title="Danger zone">
              <Button
                intent="alert"
                onClick={onDelete}
                disabled={isLoading || isDisabled}
              >
                Delete expectation
              </Button>
            </CardSecondary>
          )}

          {isEdit && !!initialData && <UpdatesForm data={initialData} />}
        </Box>
      </Box>
      <ExpectationSummary
        type={expType}
        isEdit={isEdit}
        disabled={isLoading || isDisabled}
        onSubmit={handleSubmit(handleSubmitForm)}
        disabledMainButton={
          (!isMatchingExpectation && expType === ExpectationType.existing) ||
          !isMatchingFeatureGroups ||
          (!isEdit &&
            expType === ExpectationType.new &&
            !isMatchingExpectationToAttachedFg)
        }
        errorsValue={errorsValue}
      />
      {isLoading && <Loader />}
    </FormProvider>
  );
};

export default ExpectationForm;

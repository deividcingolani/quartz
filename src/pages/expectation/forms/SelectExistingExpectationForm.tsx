// @ts-nocheck
import { Box, Flex } from 'rebass';
import { useSelector } from 'react-redux';
import { Controller, useFormContext } from 'react-hook-form';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Button,
  Callout,
  CalloutTypes,
  Labeling,
  RadioGroup,
  Select,
  Value,
} from '@logicalclocks/quartz';

// Hooks
import useNavigateRelative from '../../../hooks/useNavigateRelative';
// Types
import { RootState } from '../../../store';
import { ExpectationTypeMatch } from '../types';
import { Expectation } from '../../../types/expectation';
import { FeatureGroupViewState } from '../../../store/models/feature/featureGroupView.model';
import { selectExpectations } from '../../../store/models/expectations/expectations.selectors';
// Utils
import {
  filterExpectations,
  getMatchingFeatures,
  getNotMatchingFeatures,
} from '../utilts';

const SelectExistingExpectationForm = () => {
  const [matchType, setMatchType] = useState<ExpectationTypeMatch>(
    ExpectationTypeMatch.matching,
  );

  const navigate = useNavigateRelative();

  const { control, watch } = useFormContext();

  const { expectation } = watch(['expectation']);

  const featureGroup = useSelector<RootState, FeatureGroupViewState>(
    (state) => state.featureGroupView,
  );

  const expectations = useSelector(selectExpectations).filter(
    ({ name }) =>
      !featureGroup?.expectations.map(({ name }) => name).includes(name),
  );

  const selectedExpectation = useMemo(
    () => expectations.find(({ name }) => name === expectation[0]),
    [expectations, expectation],
  );

  const getAdditionalComponents = useCallback(
    (expectations: Expectation[]) =>
      expectations.map(({ features }) => {
        const matchingFeatures = getMatchingFeatures(featureGroup, features);
        const notMatchingFeatures = getNotMatchingFeatures(
          featureGroup,
          features,
        );

        if (features.length > 3) {
          return (
            <Labeling gray bold>
              {features.length} features
            </Labeling>
          );
        }

        return (
          <Flex>
            {!!matchingFeatures?.length && (
              <Value>{matchingFeatures?.join(', ')}</Value>
            )}
            {!!matchingFeatures?.length && !!notMatchingFeatures?.length && (
              <Value mr="3px">,</Value>
            )}
            {!!notMatchingFeatures?.length && (
              <Labeling gray bold>
                {notMatchingFeatures?.join(', ')}
              </Labeling>
            )}
          </Flex>
        );
      }),
    [featureGroup],
  );

  const expectationsData = useMemo(() => {
    const filteredExpectations = (matchType === ExpectationTypeMatch.all
      ? expectations
      : filterExpectations(expectations, featureGroup)
    ).sort((a, b) => a.name.localeCompare(b.name));

    return {
      options: filteredExpectations.map(({ name }) => name),
      additionalComponents: getAdditionalComponents(filteredExpectations),
      additionalTexts: filteredExpectations.map(
        ({ description }) => description || '',
      ),
    };
  }, [expectations, matchType, featureGroup, getAdditionalComponents]);

  const isMatchingExpectation = useMemo(
    () =>
      selectedExpectation
        ? selectedExpectation?.features.every((name) =>
            featureGroup?.features.map(({ name }) => name).includes(name),
          )
        : true,
    [featureGroup, selectedExpectation],
  );

  return (
    <>
      <Controller
        control={control}
        name="expectation"
        render={({ onChange, value }) => (
          <Select
            mt="20px"
            width="100%"
            value={value}
            listWidth="100%"
            hasSearch={true}
            label="Expectation"
            onChange={onChange}
            maxListHeight="300px"
            hasPlaceholder={false}
            {...expectationsData}
            placeholder="pick an expectation"
            noDataMessage={
              matchType === ExpectationTypeMatch.all
                ? 'no expectations'
                : 'no matching expectations'
            }
            customFilter={
              <RadioGroup
                ml="10px"
                value={matchType}
                flexDirection="row"
                onClick={(e) => e.stopPropagation()}
                options={Object.values(ExpectationTypeMatch)}
                onChange={(value) =>
                  setMatchType(value as ExpectationTypeMatch)
                }
              />
            }
            searchPlaceholder="Find an expectation by name or bound feature name..."
          />
        )}
      />
      {!isMatchingExpectation && (
        <Box mt="20px">
          <Callout
            type={CalloutTypes.error}
            content={`${featureGroup?.name} features do not match with the features of this expectations. Find a matching expectation or edit the feature of the expectation.`}
          />
        </Box>
      )}
      {!!selectedExpectation && !!featureGroup && (
        <Button
          mt="20px"
          ml="auto"
          intent="ghost"
          onClick={() =>
            navigate(
              `/${selectedExpectation.name}/${featureGroup?.name}`,
              '/p/:id/expectation/*',
            )
          }
        >
          edit expectation
        </Button>
      )}
    </>
  );
};

export default SelectExistingExpectationForm;

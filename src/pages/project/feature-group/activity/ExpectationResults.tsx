import { Box, Flex } from 'rebass';
import React, { ComponentType, FC, useMemo } from 'react';
import { Button, Microlabeling, Row, Value } from '@logicalclocks/quartz';

import LastValidation from '../overview/expectations/LastValidation';
import { getShortRuleValue } from '../../../expectation/utilts';
import { getStatusCount } from '../../../../components/activity/utils';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import useGetHrefForRoute from '../../../../hooks/useGetHrefForRoute';

import { Expectation } from '../../../../types/expectation';
import { rulesMapToShort } from '../../../expectation/types';
import { ActivityItemData } from '../../../../types/feature-group';

export interface ExpectationResultProps {
  name: string;
  data: any[];
  results: {
    expectation: Expectation;
  }[];
}

const ExpectationResult: FC<ExpectationResultProps> = ({
  name,
  data,
  results,
}) => {
  const navigate = useNavigateRelative();

  const getHref = useGetHrefForRoute();

  const rules = useMemo(
    () => data.map(({ rule, value }) => ({ ...rule, value })),
    [data],
  );

  const features = useMemo(
    () =>
      results
        .find(({ expectation }) => expectation.name === name)
        ?.expectation.features.join(', '),
    [results, name],
  );

  const successCount = useMemo(
    () =>
      getStatusCount('SUCCESS', {
        validations: {
          expectationResults: data,
        },
      } as ActivityItemData),
    [data],
  );

  const warningCount = useMemo(
    () =>
      getStatusCount('WARNING', {
        validations: {
          expectationResults: data,
        },
      } as ActivityItemData),
    [data],
  );

  const alertCount = useMemo(
    () =>
      getStatusCount('FAILURE', {
        validations: {
          expectationResults: data,
        },
      } as ActivityItemData),
    [data],
  );

  const warningsAndErrors = useMemo(
    () => data.filter(({ status }) => status !== 'SUCCESS'),
    [data],
  );

  return (
    <Box
      p="8px"
      mb="15px"
      width="100%"
      sx={{
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: 'grayShade2',
      }}
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Value fontSize="18px">{name}</Value>
        <Button
          mr="-10px"
          intent="inline"
          href={getHref(`/expectation/${name}`, '/p/:id/*')}
          onClick={() => navigate(`/expectation/${name}`, '/p/:id/*')}
        >
          edit {'->'}
        </Button>
      </Flex>
      <LastValidation
        mt="20px"
        alert={alertCount}
        success={successCount}
        warning={warningCount}
      />
      <Microlabeling mt="20px" mb="8px" gray>
        features
      </Microlabeling>
      <Value>{features}</Value>
      <Microlabeling mt="20px" mb="8px" gray>
        expectation rules
      </Microlabeling>
      <Box>
        <Row
          middleColumn={0}
          groupComponents={
            rules.map(() => [Value, Value]) as ComponentType<any>[][]
          }
          groupProps={rules.map((rule) => [
            { children: rulesMapToShort.getByKey(rule.name) },
            { children: getShortRuleValue(rule) },
          ])}
        />
      </Box>
      {!!warningsAndErrors.length && (
        <>
          <Microlabeling mt="20px" mb="8px" gray>
            errors and warnings
          </Microlabeling>
          <Box
            sx={{
              tr: {
                border: 'none',
                backgroundColor: 'grayShade3',
              },
            }}
          >
            <Row
              middleColumn={0}
              groupComponents={
                warningsAndErrors.map(() => [
                  Value,
                  Value,
                ]) as ComponentType<any>[][]
              }
              groupProps={warningsAndErrors.map(({ value, status, rule }) => [
                {
                  children: rulesMapToShort.getByKey(rule.name),
                  color: status === 'FAILURE' ? 'labels.red' : 'labels.orange',
                },
                { children: value },
              ])}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default ExpectationResult;

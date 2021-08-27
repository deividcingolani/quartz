// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { ComponentType, FC, useMemo } from 'react';
import { Box, Flex } from 'rebass';
import { Button, Microlabeling, Row, Value } from '@logicalclocks/quartz';

import { useNavigate, useParams } from 'react-router-dom';
import LastValidation from '../overview/expectations/LastValidation';
import { getShortRuleValue } from '../expectation/utilts';
import { getStatusCount } from '../../../../components/activity/utils';

import { Expectation } from '../../../../types/expectation';
import { rulesMapToShort } from '../expectation/types';
import { ActivityItemData } from '../../../../types/feature-group';
import getHrefNoMatching from '../../../../utils/getHrefNoMatching';
import routeNames from '../../../../routes/routeNames';

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
  const navigate = useNavigate();
  const { id, fsId } = useParams();

  const rules = useMemo(() => results[0].expectation.rules, [results]);

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
          href={getHrefNoMatching(
            routeNames.expectation.edit,
            routeNames.project.value,
            true,
            { id, fsId, expName: name },
          )}
          onClick={() =>
            navigate(
              getHrefNoMatching(
                routeNames.expectation.edit,
                routeNames.project.value,
                true,
                { id, fsId, expName: name },
              ),
            )
          }
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
            {results.map((el: any) => {
              if (
                !el.results.filter((el: any) => el.status === 'FAILURE').length
              ) {
                return null;
              }
              return (
                <>
                  <Value my="8px">{el.expectation.features[0]}</Value>
                  <Row
                    middleColumn={0}
                    groupComponents={
                      el.results
                        .filter((el: any) => el.status === 'FAILURE')
                        .map(() => [Value, Value]) as ComponentType<any>[][]
                    }
                    groupProps={el.results
                      .filter((el: any) => el.status === 'FAILURE')
                      .map(({ rule, value }: any) => [
                        {
                          children: rulesMapToShort.getByKey(rule.name),
                          color:
                            rule.level === 'ERROR'
                              ? 'labels.red'
                              : 'labels.orange',
                        },
                        { children: value },
                      ])}
                  />
                </>
              );
            })}
          </Box>
        </>
      )}
    </Box>
  );
};

export default ExpectationResult;

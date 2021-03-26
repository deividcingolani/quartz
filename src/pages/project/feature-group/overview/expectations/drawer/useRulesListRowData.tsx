import { Flex } from 'rebass';
import React, { useMemo } from 'react';
import { Value } from '@logicalclocks/quartz';

import { Expectation } from '../../../../../../types/expectation';
import {
  rulesMapToShort,
  RuleTypesStrong,
} from '../../../../../expectation/types';
import { getShortRuleValue } from '../../../../../expectation/utilts';

const useRulesListRowData = (data: Expectation) => {
  const groupComponents = useMemo(() => {
    return data.rules.map(({ name }) => [
      Value,
      name === RuleTypesStrong.IS_CONTAINED_IN ? Flex : Value,
    ]);
  }, [data]);

  const groupProps = useMemo(() => {
    return data.rules.map((rule) => {
      return [
        {
          primary: true,
          children: rulesMapToShort.getByKey(rule.name),
        },
        {
          ...(rule.name === RuleTypesStrong.IS_CONTAINED_IN
            ? {
                mb:
                  rule.legalValues?.length && rule.legalValues.length > 7
                    ? 0
                    : '-4px',
                flexDirection:
                  rule.legalValues?.length && rule.legalValues.length > 7
                    ? 'row'
                    : 'column',
                children:
                  rule.legalValues?.length && rule.legalValues.length > 7 ? (
                    <Value
                      sx={{
                        whiteSpace: 'pre-line',
                      }}
                      maxWidth="235px"
                    >
                      {rule.legalValues?.map((value) => value).join(' ; ')}
                    </Value>
                  ) : (
                    rule.legalValues?.map((value, index) => (
                      <Value mb="4px" key={`${value}-${index}`}>
                        {value}
                      </Value>
                    ))
                  ),
              }
            : {
                children: getShortRuleValue(rule),
              }),
        },
      ];
    });
  }, [data]);

  return useMemo(() => {
    return [groupComponents, groupProps];
  }, [groupComponents, groupProps]);
};

export default useRulesListRowData;

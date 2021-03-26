import { Box, Flex } from 'rebass';
import React, { FC, memo, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Callout,
  CalloutTypes,
  Divider,
  Labeling,
  RadioGroup,
  Select,
} from '@logicalclocks/quartz';

import RuleFormByType from './RuleFormByType';

import { FormRule, rulesMap, RuleTypes, RuleTypesStrong } from '../types';
import { getRuleDescription } from '../utilts';
import getInputValidation from '../../../utils/getInputValidation';

import icons from '../../../sources/icons';

export interface SingleRuleFormProps {
  rules: FormRule[];
  index: number;
  hasNext: boolean;
  options: string[];
  isDisabled: boolean;
  onRemove: (index: number) => () => void;
  onChange: (type: string, value: string | string[], index: number) => void;
}

const SingleRuleForm: FC<SingleRuleFormProps> = ({
  rules,
  index,
  options,
  onChange,
  onRemove,
  isDisabled,
  hasNext,
}) => {
  const rule = useMemo(() => rules[index], [index, rules]);

  const Form = (
    <RuleFormByType
      rule={rule}
      rules={rules}
      index={index}
      onChange={onChange}
      isDisabled={isDisabled}
    />
  );

  const { errors, watch } = useFormContext();

  const ruleErrors = errors.rules || [];

  const { min, max } = rule;

  const { features } = watch(['features']);

  const mappedOptions = useMemo(() => {
    const copy = options.slice();

    const inequalitiesCount = rules.filter(
      ({ type }) => type === RuleTypes.HAS_INEQUALITIES,
    ).length;

    if (inequalitiesCount < 4) {
      copy.push(RuleTypesStrong.HAS_INEQUALITIES);
    }

    return copy
      .map((name) => rulesMap.getByKey(name))
      .filter(
        (name) =>
          ![
            RuleTypes.IS_LESS_THAN,
            RuleTypes.IS_GREATER_THAN,
            RuleTypes.IS_LESS_THAN_OR_EQUAL_TO,
            RuleTypes.IS_GREATER_THAN_OR_EQUAL_TO,
          ].includes(name as RuleTypes),
      )
      .sort((a, b) => a.localeCompare(b));
  }, [options, rules]);

  return (
    <Flex flexDirection="column" mb="20px">
      <Flex>
        <Select
          mr="20px"
          width="200px"
          listWidth="100%"
          height="fit-content"
          maxListHeight="200px"
          disabled={isDisabled}
          hasPlaceholder={false}
          options={mappedOptions}
          placeholder="pick rule type"
          value={!!rule.type ? [rule.type] : []}
          label={`Expectation rule #${index + 1}`}
          {...getInputValidation(`ruleType`, ruleErrors[index])}
          onChange={(value) => onChange('type', value[0], index)}
        />

        {!!Form && Form}

        {index > 0 && (
          <Box
            p="5px"
            ml="auto"
            height="28px"
            sx={{
              cursor: 'pointer',
              backgroundColor: '#ffffff',
              transition: 'all .4s ease',

              ':hover': {
                backgroundColor: 'grayShade3',
              },

              svg: {
                width: '20px',
                height: '20px',
              },
            }}
            onClick={() => !isDisabled && onRemove(index)()}
          >
            {icons.cross}
          </Box>
        )}
      </Flex>

      <Box mt="8px">
        <RadioGroup
          mr="8px"
          flexDirection="row"
          value={rule.severity}
          options={['warning', 'alert']}
          onChange={(value) => onChange('severity', value, index)}
        />
      </Box>

      {!!getRuleDescription(rule, features) && (
        <Box
          p="8px"
          mt="8px"
          sx={{
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'grayShade2',
          }}
        >
          <Labeling>{getRuleDescription(rule, features)}</Labeling>
        </Box>
      )}

      {!!min && !!max && +min > +max && (
        <Box mt="20px">
          <Callout
            type={CalloutTypes.warning}
            content="The maximum value can not be over the minimum value"
          />
        </Box>
      )}

      {[
        RuleTypes.IS_LESS_THAN,
        RuleTypes.IS_GREATER_THAN,
        RuleTypes.IS_LESS_THAN_OR_EQUAL_TO,
        RuleTypes.IS_GREATER_THAN_OR_EQUAL_TO,
        RuleTypes.HAS_MUTUAL_INFORMATION,
        RuleTypes.HAS_CORRELATION,
      ].includes(rule.type as RuleTypes) && (
        <>
          {features?.length < 2 && (
            <Box mt="20px">
              <Callout
                type={CalloutTypes.warning}
                content="At least two features need be provided in the expectation features"
              />
            </Box>
          )}

          {features?.length > 2 && (
            <Box mt="20px">
              <Callout
                type={CalloutTypes.warning}
                content="The comparison is performed on the first two features of the expectation, in the order they are defined"
              />
            </Box>
          )}
        </>
      )}

      {hasNext && <Divider mb="0" />}
    </Flex>
  );
};

export default memo(SingleRuleForm);

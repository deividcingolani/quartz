import React, { FC, memo } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input, Select } from '@logicalclocks/quartz';

import { FormRule, RuleTypes } from '../types';
import getInputValidation from '../../../utils/getInputValidation';

export interface RuleFormByTypeProps {
  index: number;
  rule: FormRule;
  rules: FormRule[];
  isDisabled: boolean;
  onChange: (type: string, value: string | string[], index: number) => void;
}

export enum MatchTypes {
  exactly = 'exactly',
  between = 'between',
}

const RuleFormByType: FC<RuleFormByTypeProps> = ({
  rule,
  rules,
  index,
  onChange,
  isDisabled,
}) => {
  const { errors } = useFormContext();

  const ruleErrors = errors.rules || [];

  if (rule.type === RuleTypes.HAS_PATTERN) {
    return (
      <Input
        label="Pattern"
        value={rule.pattern}
        disabled={isDisabled}
        placeholder="/([A-Z])\w+/g"
        onChange={({ target }) => onChange('pattern', target.value, index)}
        {...getInputValidation(`pattern`, ruleErrors[index])}
      />
    );
  }

  if (rule.type === RuleTypes.IS_CONTAINED_IN) {
    return (
      <Input
        label="Values"
        disabled={isDisabled}
        value={rule.legalValues}
        placeholder="value1 ; value2"
        {...getInputValidation(`legalValues`, ruleErrors[index])}
        onChange={({ target }) => onChange('legalValues', target.value, index)}
      />
    );
  }

  if (rule.type === RuleTypes.HAS_DATATYPE) {
    return (
      <Select
        label="Datatype"
        listWidth="100%"
        placeholder="any"
        height="fit-content"
        disabled={isDisabled}
        hasPlaceholder={false}
        value={rule.datatype ? rule.datatype : []}
        onChange={(value) => onChange('datatype', value, index)}
        options={[
          'Null',
          'Fractional',
          'Integral',
          'Boolean',
          'String',
          'Numeric',
        ]}
      />
    );
  }

  if (rule.type === RuleTypes.IS_CONTAINED_IN) {
    return (
      <Input
        label="Values"
        value={rule.min}
        disabled={isDisabled}
        placeholder="value_1 ; value_2"
        onChange={({ target }) => onChange('min', target.value, index)}
        {...getInputValidation(`min`, ruleErrors[index])}
      />
    );
  }

  if (rule.type === RuleTypes.HAS_INEQUALITIES) {
    return (
      <Select
        listWidth="100%"
        label="Inequality"
        height="fit-content"
        disabled={isDisabled}
        hasPlaceholder={false}
        placeholder="inequality"
        value={rule.inequality ? rule.inequality : []}
        onChange={(value) => onChange('inequality', value, index)}
        options={[
          RuleTypes.IS_LESS_THAN,
          RuleTypes.IS_GREATER_THAN,
          RuleTypes.IS_LESS_THAN_OR_EQUAL_TO,
          RuleTypes.IS_GREATER_THAN_OR_EQUAL_TO,
        ].filter(
          (name) =>
            !rules
              .map(({ inequality }) => inequality && inequality[0])
              .includes(name),
        )}
      />
    );
  }

  if (
    [
      RuleTypes.IS_POSITIVE,
      RuleTypes.IS_NON_NEGATIVE,
      RuleTypes.HAS_MUTUAL_INFORMATION,
    ].includes(rule.type as RuleTypes)
  ) {
    return (
      <>
        <Select
          mr="20px"
          listWidth="100%"
          label="Proportion"
          height="fit-content"
          disabled={isDisabled}
          hasPlaceholder={false}
          placeholder="proportion"
          options={Object.values(MatchTypes)}
          value={rule.match ? rule.match : []}
          onChange={(value) => onChange('match', value, index)}
        />

        {rule.match && rule.match[0] === MatchTypes.exactly ? (
          <Input
            placeholder="0"
            value={rule.exact}
            disabled={isDisabled}
            label="Exact proportion"
            onChange={({ target }) => onChange('exact', target.value, index)}
            {...getInputValidation(`exact`, ruleErrors[index])}
          />
        ) : (
          <>
            <Input
              labelProps={{
                mr: '20px',
              }}
              placeholder="0"
              value={rule.min}
              disabled={isDisabled}
              label="Min proportion"
              onChange={({ target }) => onChange('min', target.value, index)}
              {...getInputValidation(`min`, ruleErrors[index])}
            />
            <Input
              placeholder="0"
              value={rule.max}
              label="Max proportion"
              disabled={isDisabled}
              onChange={({ target }) => onChange('max', target.value, index)}
              {...getInputValidation(`max`, ruleErrors[index])}
            />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <Select
        mr="20px"
        label="Match"
        listWidth="100%"
        placeholder="match"
        height="fit-content"
        disabled={isDisabled}
        hasPlaceholder={false}
        options={Object.values(MatchTypes)}
        value={rule.match ? rule.match : []}
        onChange={(value) => onChange('match', value, index)}
      />

      {rule.match && rule.match[0] === MatchTypes.exactly ? (
        <Input
          placeholder="0"
          value={rule.exact}
          label="Exact value"
          disabled={isDisabled}
          onChange={({ target }) => onChange('exact', target.value, index)}
          {...getInputValidation(`exact`, ruleErrors[index])}
        />
      ) : (
        <>
          <Input
            labelProps={{
              mr: '20px',
            }}
            placeholder="0"
            value={rule.min}
            label="Min value"
            disabled={isDisabled}
            onChange={({ target }) => onChange('min', target.value, index)}
            {...getInputValidation(`min`, ruleErrors[index])}
          />
          <Input
            placeholder="0"
            value={rule.max}
            label="Max value"
            disabled={isDisabled}
            onChange={({ target }) => onChange('max', target.value, index)}
            {...getInputValidation(`max`, ruleErrors[index])}
          />
        </>
      )}
    </>
  );
};

export default memo(RuleFormByType);

// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Box } from 'rebass';
import { useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import {
  Button,
  Callout,
  CalloutTypes,
  CardSecondary,
} from '@logicalclocks/quartz';

// Components
import SingleRuleForm from './SingleRuleForm';
import Loader from '../../../components/loader/Loader';
// Selectors
import {
  selectRules,
  selectRulesLoading,
} from '../../../store/models/rules/rules.selectors';
// Types
import { FormRule, rulesMap, RuleTypes } from '../types';
// Utils
import { getNewRuleProps } from '../utilts';
import randomString from '../../../utils/randomString';

export interface RulesFormProps {
  isEdit?: boolean;
  isDisabled: boolean;
}

const RulesForm: FC<RulesFormProps> = ({ isDisabled, isEdit }) => {
  const { setValue, errors, getValues } = useFormContext();

  const serverRules = useSelector(selectRules);

  const serverOptions = useMemo(
    () =>
      serverRules
        .map(({ name }) => name)
        .filter((name) => rulesMap.getByKey(name)),
    [serverRules],
  );

  const [rules, setRules] = useState<FormRule[]>([
    {
      id: randomString(),
      severity: 'warning',
    },
  ]);

  const handleRuleAdd = () => {
    setRules((prev) => [...prev, { id: randomString(), severity: 'warning' }]);
  };

  const [options, setOptions] = useState<string[]>(
    serverRules.map(({ name }) => name),
  );

  const handleRemove = useCallback(
    (index: number) => () => {
      setRules((prev) => {
        const copy = prev.slice();
        copy.splice(index, 1);

        return copy;
      });
    },
    [],
  );

  const onChange = useCallback(
    (type: string, value: string | string[], index: number) => {
      const ruleCopy = rules.slice();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ruleCopy[index][type] = value;

      if (type === 'type') {
        ruleCopy[index] = {
          ...ruleCopy[index],
          ...getNewRuleProps(value as RuleTypes),
        };
      }

      setRules(ruleCopy);
    },
    [rules],
  );

  useEffect(() => {
    const availableOptions = serverOptions.filter(
      (option) =>
        !rules.map(({ type }) => type).includes(rulesMap.getByKey(option)),
    );

    setOptions(availableOptions);
  }, [rules, serverOptions]);

  useEffect(() => {
    const expRules = getValues('rules');

    if (isEdit && expRules) {
      setRules(
        expRules.map((rule: any) => ({
          ...rule,
          id: randomString(),
        })),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit]);

  useEffect(() => {
    setValue('rules', rules);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rules]);

  const isLoading = useSelector(selectRulesLoading);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Box mt="20px" mb="10px">
        {!!errors.rulesForm && (
          <Callout
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            type={CalloutTypes.error}
            content={errors.rulesForm.message}
          />
        )}
      </Box>

      <CardSecondary title="Rules">
        {rules.map((rule, index) => (
          <SingleRuleForm
            rules={rules}
            key={rule.id}
            index={index}
            options={options}
            onChange={onChange}
            isDisabled={isDisabled}
            onRemove={handleRemove}
            hasNext={index !== rules.length - 1}
          />
        ))}

        <Button
          onClick={handleRuleAdd}
          disabled={rules.length === serverOptions.length || isDisabled}
        >
          Add another rule
        </Button>
      </CardSecondary>
    </>
  );
};

export default memo(RulesForm);

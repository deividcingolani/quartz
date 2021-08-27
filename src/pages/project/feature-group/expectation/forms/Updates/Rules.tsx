// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useMemo } from 'react';

import Result from './Result';
import Unchanged from './Unchanged';

import { FormRule, rulesMap } from '../../types';
import { ServerRule } from '../../../../../../types/expectation';
import { getEditedRulesCount, mapRulesToForm } from '../../utilts';

export interface RulesProps {
  data: FormRule[];
  prevData: ServerRule[];
}

const Rules: FC<RulesProps> = ({ data, prevData }) => {
  const mappedRules = useMemo(() => mapRulesToForm(prevData), [prevData]);

  const editedCount = useMemo(
    () => getEditedRulesCount(mappedRules as FormRule[], data),
    [mappedRules, data],
  );

  const newCount = useMemo(
    () =>
      data.filter(
        ({ type }) =>
          type &&
          !prevData.map(({ name }) => rulesMap.getByKey(name)).includes(type),
      ).length,
    [data, prevData],
  );

  const removedCount = useMemo(
    () =>
      prevData
        .map(({ name }) => rulesMap.getByKey(name))
        .filter((name) => !data.map(({ type }) => type).includes(name)).length,
    [data, prevData],
  );

  const isUnchanged = useMemo(
    () => !newCount && !removedCount && !editedCount,
    [newCount, removedCount, editedCount],
  );

  if (isUnchanged) {
    return <Unchanged title="Rules" />;
  }

  return (
    <Result
      title="Rules"
      newCount={newCount}
      editedCount={editedCount}
      removedCount={removedCount}
    />
  );
};

export default Rules;

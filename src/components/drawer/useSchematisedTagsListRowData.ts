import { useMemo } from 'react';
import { Value } from '@logicalclocks/quartz';

const useSchematisedTagsListRowData = (tag: { [key: string]: string }) => {
  const groupComponents = useMemo(() => {
    return Object.entries(tag).map(() => [Value, Value]);
  }, [tag]);

  const groupProps = useMemo(() => {
    return Object.entries(tag).map(([key, value]) => [
      {
        children: key,
      },
      {
        children: value,
        primary: true,
      },
    ]);
  }, [tag]);

  return useMemo(() => {
    return [groupComponents, groupProps];
  }, [groupComponents, groupProps]);
};

export default useSchematisedTagsListRowData;

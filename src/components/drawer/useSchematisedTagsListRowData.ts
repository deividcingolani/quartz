import { useMemo } from 'react';
import { Labeling, Value } from '@logicalclocks/quartz';

const useSchematisedTagsListRowData = (tag: { [key: string]: string }) => {
  const groupComponents = useMemo(() => {
    return Object.entries(tag).map(() => [Value, Labeling]);
  }, [tag]);

  const groupProps = useMemo(() => {
    return Object.entries(tag).map(([key, value]) => [
      {
        children: key,
      },
      {
        children: Array.isArray(value) ? value.join(', ') : value.toString(),
        gray: true,
      },
    ]);
  }, [tag]);

  return useMemo(() => {
    return [groupComponents, groupProps];
  }, [groupComponents, groupProps]);
};

export default useSchematisedTagsListRowData;

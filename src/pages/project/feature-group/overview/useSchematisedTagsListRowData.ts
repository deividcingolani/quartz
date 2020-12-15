import { useMemo } from 'react';
import { Value, Labeling, Badge } from '@logicalclocks/quartz';

// Types
import { Tag } from '../../../../types';

const useSchematisedTagsListRowData = (tag?: Tag) => {
  const groupComponents = useMemo(() => {
    return Object.values(tag?.tags || []).map(() => [Value, Labeling, Badge]);
  }, [tag]);

  const groupProps = useMemo(() => {
    return Object.entries(tag?.tags || []).map(([key, value]) => [
      {
        children: key,
      },
      {
        children: Array.isArray(value) ? value.join(', ') : value.toString(),
        gray: true,
      },
      {
        value: tag?.types[key],
        width: 'max-content',
      },
    ]);
  }, [tag]);

  return useMemo(() => {
    return [groupComponents, groupProps];
  }, [groupComponents, groupProps]);
};

export default useSchematisedTagsListRowData;

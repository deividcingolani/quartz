import { useMemo } from 'react';
import { Value, Badge } from '@logicalclocks/quartz';

import { SchematisedTag } from '../types/feature-group';

const useSchematisedTagsRowData = (schematisedTags: SchematisedTag[]) => {
  const groupComponents = useMemo(() => {
    return schematisedTags.map(() => [Badge, Value, Value]);
  }, [schematisedTags]);

  const groupProps = useMemo(() => {
    return schematisedTags.map(({ name, value, type }) => [
      {
        value: type,
      },
      {
        children: name,
      },
      {
        children: value,
      },
    ]);
  }, [schematisedTags]);

  return useMemo(() => {
    return [groupComponents, groupProps];
  }, [groupComponents, groupProps]);
};

export default useSchematisedTagsRowData;

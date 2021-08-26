import { useMemo } from 'react';
import { IconButton, IconName, Value } from '@logicalclocks/quartz';
import { SchematisedTagEntity } from '../../../../types/feature-group';

const useSchematisedTagsListRows = (
  data: SchematisedTagEntity[],
  onView: (name: string) => void,
) => {
  const groupComponents = useMemo(() => {
    return data.map(() => [Value, Value, Value, IconButton]);
  }, [data]);

  const groupProps = useMemo(() => {
    return data.map((tag) => [
      {
        children: tag.name,
      },
      {
        children: `${Object.keys(tag.properties).length} fields`,
        primary: true,
      },
      {
        children: tag.description,
      },
      {
        intent: 'ghost',
        icon: IconName.eye,
        tooltip: 'View',
        onClick: () => onView(tag.name),
      },
    ]);
  }, [data, onView]);

  return useMemo(() => {
    return [groupComponents, groupProps];
  }, [groupComponents, groupProps]);
};

export default useSchematisedTagsListRows;

import { useMemo } from 'react';
import { Badge, Value } from '@logicalclocks/quartz';
import { SchematisedTagEntity } from '../../../../types/feature-group';
import { propertiesMap } from '../utils';

const usePropertiesListRows = (data: SchematisedTagEntity) => {
  const groupComponents = useMemo(() => {
    return Object.entries(data.properties).map(() => [Value, Badge]);
  }, [data]);

  const groupProps = useMemo(() => {
    return Object.entries(data.properties).map(([key, value]) => [
      {
        children: key,
      },
      {
        width: 'max-content',
        value:
          value.type === 'array'
            ? `Array of ${propertiesMap.getByValue(value.items?.type || '')}`
            : propertiesMap.getByValue(value.type),
      },
    ]);
  }, [data]);

  return useMemo(() => {
    return [groupComponents, groupProps];
  }, [groupComponents, groupProps]);
};

export default usePropertiesListRows;

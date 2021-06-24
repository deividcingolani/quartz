// eslint-disable-next-line import/no-unresolved
import { FGRow } from '@logicalclocks/quartz/dist/components/table/type';
import { Property, SchematisedTagEntity } from '../../../types/feature-group';
import { getColumnValueByName } from '../../project/feature-group/utils';
import labelValueMap from '../../../utils/labelValueBind';

export interface CreateProperties {
  properties: Property;
  required: string[];
}

export const propertiesMap = labelValueMap<{ [key: string]: string }>({
  String: 'string',
  Integer: 'integer',
  Float: 'number',
  Boolean: 'boolean',
  'Array of Float': 'array',
  'Array of Integer': 'array',
  'Array of String': 'array',
  'Array of Boolean': 'array',
});

export const mapProperties = (data: FGRow[]): CreateProperties => {
  return data.reduce(
    (acc: CreateProperties, { row }) => {
      const name = getColumnValueByName(row, 'Name') as string;
      const description = getColumnValueByName(row, 'Description') as string;
      const required = getColumnValueByName(row, 'Required') as boolean;
      const type = (getColumnValueByName(row, 'Type') as string[])[0];

      if (type.includes('Array')) {
        const itemType = type.slice(type.lastIndexOf(' ') + 1);
        acc.properties[name] = {
          description,
          type: 'array',
          items: {
            type: propertiesMap.getByKey(itemType),
          },
        };
      } else {
        acc.properties[name] = {
          description,
          type: propertiesMap.getByKey(type),
        };
      }
      if (required) {
        acc.required.push(name as string);
      }
      return acc;
    },
    {
      properties: {},
      required: [],
    },
  );
};

export const mapPropertiesToTable = (data: SchematisedTagEntity): FGRow[] => {
  return Object.entries(data.properties).map(([key, { description, type }]) => {
    return {
      row: [
        {
          columnName: 'Name',
          columnValue: key,
        },
        {
          columnName: 'Type',
          columnValue: [propertiesMap.getByValue(type) as string],
        },
        {
          columnName: 'Required',
          columnValue: data.required.includes(key),
        },
        {
          columnName: 'Description',
          columnValue: description,
        },
      ],
    };
  });
};

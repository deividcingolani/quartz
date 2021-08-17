// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React from 'react';
import {
  BlurInput,
  Checkbox,
  Select,
  TableColumn,
} from '@logicalclocks/quartz';

const propertiesColumns: TableColumn[] = [
  {
    name: 'Name',
    render: ({ value, onChange }) => (
      <BlurInput
        width="100%"
        minWidth="100px"
        placeholder="property name"
        defaultValue={value}
        onChange={onChange}
      />
    ),
  },
  {
    name: 'Type',
    render: ({ value, onChange }) => (
      <Select
        minWidth="110px"
        width="auto"
        value={value}
        onChange={onChange}
        options={[
          'String',
          'Integer',
          'Float',
          'Boolean',
          'Array of Float',
          'Array of Integer',
          'Array of String',
          'Array of Boolean',
        ]}
        placeholder=""
      />
    ),
  },
  {
    name: 'Required',
    render: ({ value, onChange }) => {
      const handleChange = () => {
        onChange(!value);
      };

      return (
        <Checkbox
          ml="8px"
          width="80px"
          checked={value}
          onChange={handleChange}
          variant="gray"
        />
      );
    },
  },
  {
    name: 'Description',
    render: ({ value, onChange }) => (
      <BlurInput
        width="100%"
        minWidth="300px"
        placeholder="property description"
        defaultValue={value}
        onChange={onChange}
      />
    ),
  },
];

export default propertiesColumns;

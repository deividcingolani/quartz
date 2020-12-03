import React from 'react';
import { BlurInput, Checkbox, Select } from '@logicalclocks/quartz';
import { TableColumn } from '@logicalclocks/quartz/dist/components/table/editable';

export const featuresColumns = (isEdit = false): TableColumn[] => {
  const columns: any[] = [
    {
      name: 'Name',
      // @ts-ignore
      render: ({ value, onChange }) => (
        <BlurInput
          width="100%"
          minWidth="100px"
          placeholder="feature name"
          defaultValue={value}
          onChange={onChange}
        />
      ),
    },
    {
      name: 'Offline type',
      // @ts-ignore
      render: ({ value, onChange }) => (
        <Select
          width="110px"
          value={value}
          onChange={onChange}
          options={[
            'INT',
            'FLOAT',
            'DOUBLE',
            'BIGINT',
            'STRING',
            'BOOLEAN',
            'VARCHAR(1000)',
          ]}
          placeholder=""
        />
      ),
    },
    {
      name: 'Online type',
      // @ts-ignore
      render: ({ value, onChange }) => (
        <Select
          width="110px"
          value={value}
          onChange={onChange}
          options={['INT', 'FLOAT', 'TEXT', 'DOUBLE', 'VARCHAR(1000)']}
          placeholder=""
        />
      ),
    },
    {
      name: 'Primary key',
      // @ts-ignore
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
      name: 'Partition key',
      // @ts-ignore
      render: ({ value, onChange }) => {
        const handleChange = () => {
          onChange(!value);
        };

        return (
          <Checkbox
            ml="8px"
            width="85px"
            checked={value}
            onChange={handleChange}
            variant="gray"
          />
        );
      },
    },
    {
      name: 'Statistics',
      // @ts-ignore
      render: ({ value, onChange }) => {
        const handleChange = () => {
          onChange(!value);
        };

        return (
          <Checkbox
            ml="8px"
            width="auto"
            checked={value}
            onChange={handleChange}
            variant="gray"
          />
        );
      },
    },
    {
      name: 'Description',
      // @ts-ignore
      render: ({ value, onChange }) => (
        <BlurInput
          width="100%"
          minWidth="300px"
          placeholder="feature description"
          defaultValue={value}
          onChange={onChange}
        />
      ),
    },
  ];
  if (isEdit) {
    columns.splice(6, 0, {
      name: 'Default Value',
      // @ts-ignore
      render: ({ value, onChange, readOnly }) => (
        <BlurInput
          minWidth="100px"
          width="100%"
          readOnly={readOnly}
          placeholder=""
          defaultValue={value}
          onChange={onChange}
        />
      ),
    });
  }
  return columns;
};

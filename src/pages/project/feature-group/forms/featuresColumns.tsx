// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React from 'react';
import {
  BlurInput,
  Checkbox,
  EditableSelect,
  TableColumn,
} from '@logicalclocks/quartz';

// eslint-disable-next-line import/prefer-default-export
export const featuresColumns = (
  isEdit = false,
  offlineTypes: string[],
  onlineTypes: string[],
): TableColumn[] => {
  const columns: any[] = [
    {
      name: 'Name',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      render: ({ value, onChange }) => (
        <EditableSelect
          isMulti={false}
          placeholder="pick a type"
          value={value}
          onChange={onChange}
          options={offlineTypes}
        />
      ),
    },
    {
      name: 'Online type',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      render: ({ value, onChange }) => (
        <EditableSelect
          isMulti={false}
          placeholder="pick a type"
          value={value}
          onChange={onChange}
          options={onlineTypes}
        />
      ),
    },
    {
      name: 'Primary key',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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

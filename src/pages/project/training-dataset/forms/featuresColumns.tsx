import React from 'react';
import { Checkbox, Input } from '@logicalclocks/quartz';
import { TableColumn } from '@logicalclocks/quartz/dist/components/table/editable';

export const featuresColumns = (): TableColumn[] => {
  return [
    {
      name: 'Name',
      render: ({ value }) => <Input disabled={true} value={value} />,
    },
    {
      name: 'Statistics',
      render: ({ value, onChange }) => {
        const handleChange = () => {
          onChange(!value);
        };

        return (
          <Checkbox
            ml="8px"
            checked={value}
            onChange={handleChange}
            variant="gray"
          />
        );
      },
    },
  ];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React from 'react';
import { Checkbox, Input, TableColumn } from '@logicalclocks/quartz';

const featuresColumns = (): TableColumn[] => {
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

export default featuresColumns;

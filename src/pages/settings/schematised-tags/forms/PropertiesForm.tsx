import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { Button, EditableTable, Label } from '@logicalclocks/quartz';
import { Box } from 'rebass';

// Types
import { FGRow } from '@logicalclocks/quartz/dist/components/table/type';
import { propertiesColumns } from './PropertiesColumns';

const PropertiesForm: FC<any> = ({
  setValue,
  isEdit,
  getValues,
  isDisabled,
}) => {
  const [properties, setProperties] = useState<FGRow[]>(
    isEdit ? getValues().properties : [],
  );

  const handleChangeData = useCallback(
    (
      rowInd: number,
      columnName: string,
      value: string | string[] | boolean,
    ) => {
      setProperties((data) => {
        const prevData = data.slice();
        return [
          ...prevData.map((data, rIndex) => ({
            ...data,
            row: data.row.map((r) =>
              r.columnName === columnName && rIndex === rowInd
                ? { ...r, columnValue: value }
                : r,
            ),
          })),
        ];
      });
    },
    [],
  );

  useEffect(() => {
    setValue('properties', properties);
  }, [properties, setValue]);

  const handleRemoveRow = useCallback((ind: number) => {
    setProperties((data) => {
      const prevData = data.slice();
      prevData.splice(ind, 1);
      return [...prevData];
    });
  }, []);

  const handleAddRow = () => {
    const newProperty = {
      row: [
        {
          columnName: 'Name',
          columnValue: '',
        },
        {
          columnName: 'Type',
          columnValue: ['String'],
        },
        {
          columnName: 'Required',
          columnValue: true,
        },
        {
          columnName: 'Description',
          columnValue: '',
        },
      ],
    };
    setProperties((prevData) => [newProperty, ...prevData]);
  };

  return (
    <Box mt="20px">
      <Label mb="10px">Properties</Label>
      <Button disabled={isDisabled} mb="10px" onClick={handleAddRow}>
        Add a property
      </Button>
      {!!properties.length && (
        <EditableTable
          minWidth="100%"
          columns={propertiesColumns}
          values={properties}
          onChangeData={handleChangeData}
          onDeleteRow={handleRemoveRow}
          actions={[]}
        />
      )}
    </Box>
  );
};

export default memo(PropertiesForm);

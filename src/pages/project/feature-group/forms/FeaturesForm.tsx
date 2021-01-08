import { Box } from 'rebass';
import { useFormContext } from 'react-hook-form';
import { Button, EditableTable, Label } from '@logicalclocks/quartz';
import React, { FC, memo, useCallback, useEffect, useState } from 'react';

// Types
import { FeatureFormProps } from '../types';
import { featuresColumns } from './featuresColumns';
import { FGRow } from '@logicalclocks/quartz/dist/components/table/type';

const FeaturesForm: FC<FeatureFormProps> = ({ isEdit, isDisabled }) => {
  const { getValues, setValue } = useFormContext();

  const [features, setFeatures] = useState<FGRow[]>(
    isEdit ? getValues().features : [],
  );

  const handleChangeData = useCallback(
    (
      rowInd: number,
      columnName: string,
      value: string | string[] | boolean,
    ) => {
      setFeatures((data) => {
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
    setValue('features', features);
  }, [features, setValue]);

  const handleRemoveRow = useCallback((ind: number) => {
    setFeatures((data) => {
      const prevData = data.slice();
      prevData.splice(ind, 1);
      return [...prevData];
    });
  }, []);

  const handleAddRow = () => {
    const newFeature = {
      row: [
        {
          columnName: 'Name',
          columnValue: '',
        },
        {
          columnName: 'Offline type',
          columnValue: [],
        },

        {
          columnName: 'Online type',
          columnValue: [],
        },
        {
          columnName: 'Primary key',
          columnValue: false,
        },
        {
          columnName: 'Partition key',
          columnValue: false,
        },
        {
          columnName: 'Statistics',
          columnValue: true,
        },
        {
          columnName: 'Description',
          columnValue: '',
        },
      ],
    };
    if (isEdit) {
      newFeature.row.push({
        columnName: 'Default Value',
        columnValue: '',
      });
    }
    setFeatures((prevData) => [newFeature, ...prevData]);
  };

  return (
    <Box mt="20px" mb="10px">
      <Label mb="20px">Features</Label>
      <Button disabled={isDisabled} mb="20px" onClick={handleAddRow}>
        Add a feature
      </Button>
      {!!features.length && (
        <EditableTable
          sx={{ table: { whiteSpace: 'nowrap' } }}
          minWidth="100%"
          columns={featuresColumns(isEdit)}
          values={features}
          onChangeData={handleChangeData}
          onDeleteRow={handleRemoveRow}
          actions={[]}
        />
      )}
    </Box>
  );
};

export default memo(FeaturesForm);

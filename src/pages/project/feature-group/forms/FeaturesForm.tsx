// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { Box } from 'rebass';
import { useFormContext } from 'react-hook-form';
import { Button, EditableTable, Label, FGRow } from '@logicalclocks/quartz';

// Types
import { useSelector } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useParams } from 'react-router';
import { FeatureFormProps } from '../types';
import { featuresColumns } from './featuresColumns';
import { RootState } from '../../../../store';

const FeaturesForm: FC<FeatureFormProps> = ({ isEdit, isDisabled }) => {
  const { id } = useParams();

  const { getValues, setValue } = useFormContext();

  const [features, setFeatures] = useState<FGRow[]>(
    isEdit ? getValues().features : [],
  );

  const fsSettings = useSelector(
    (state: RootState) => state.featureStoreSettings,
  );

  // Default types (suggestedHiveFeatureTypes and suggestedMysqlFeatureTypes) are taken
  // from the feature store settings. Additionally the feature group could contain custom
  // types. These custom types are added to the list of types as well.
  // we use a set to avoid duplicates
  const offlineTypes = Array.from(
    new Set(
      (fsSettings?.suggestedHiveFeatureTypes
        ? fsSettings.suggestedHiveFeatureTypes
        : []
      )
        .concat(
          features.flatMap(
            (fgRow) =>
              fgRow.row
                .filter((field) => field.columnName === 'Offline type')
                .map((field) => field.columnValue as string[])
                .filter((offlineType) => offlineType.length !== 0)
                .map((offlineType) => offlineType[0]),
            // filter out empty arrays as in the case of a new feature group
          ),
        )
        .map((offlineType: string) => offlineType.toLowerCase()),
    ),
  );

  const onlineTypes = Array.from(
    new Set(
      (fsSettings?.suggestedMysqlFeatureTypes
        ? fsSettings.suggestedMysqlFeatureTypes
        : []
      )
        .concat(
          features.flatMap((fgRow) =>
            fgRow.row
              .filter((field) => field.columnName === 'Online type')
              // filter out empty arrays, meaning that the feature group
              // doesn't have any online feature
              .map((field) => field.columnValue as string[])
              .filter((onlineType) => onlineType.length !== 0)
              .map((onlineType) => onlineType[0]),
          ),
        )
        .map((onlineType: string) => onlineType.toLowerCase()),
    ),
  );

  useEffect(() => {
    setValue('features', features);
  }, [features, id, setValue]);

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
    <Box mt="20px" mb="20px">
      <Label mb="20px">Features</Label>
      <Button disabled={isDisabled} mb="20px" onClick={handleAddRow}>
        Add a feature
      </Button>
      {!!features.length && (
        <EditableTable
          sx={{ table: { whiteSpace: 'nowrap' } }}
          maxWidth="100%"
          columns={featuresColumns(isEdit, offlineTypes, onlineTypes)}
          values={features}
          onChangeData={handleChangeData}
          onDeleteRow={handleRemoveRow}
          actions={[]}
          hasFreezeButton={false}
        />
      )}
    </Box>
  );
};

export default memo(FeaturesForm);

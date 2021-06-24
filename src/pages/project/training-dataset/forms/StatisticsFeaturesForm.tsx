// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Box } from 'rebass';
import { useFormContext } from 'react-hook-form';
import { EditableTable, CardSecondary } from '@logicalclocks/quartz';
// eslint-disable-next-line import/no-unresolved
import { FGRow } from '@logicalclocks/quartz/dist/components/table/type';

import tableStyles from './table.styles';
import featuresColumns from './featuresColumns';
import { createStatistics } from '../utils';

const StatisticsFeaturesForm: FC = () => {
  const { setValue, getValues } = useFormContext();

  const [features, setFeatures] = useState<FGRow[]>(
    createStatistics(getValues('features'), getValues('statisticsColumns')),
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
    const columns = features.reduce((acc: string[], { row }) => {
      const isIncludes = row[1].columnValue;

      return isIncludes ? [...acc, row[0].columnValue as string] : acc;
    }, []);

    setValue('statisticsColumns', columns);
  }, [features, setValue]);

  const handleRemoveRow = useCallback((ind: number) => {
    setFeatures((data) => {
      const prevData = data.slice();
      prevData.splice(ind, 1);

      return [...prevData];
    });
  }, []);

  return (
    <CardSecondary mb="20px" title="Features">
      <Box sx={tableStyles}>
        {!!features.length && (
          <EditableTable
            hasFreezeButton={false}
            minWidth="100%"
            columns={featuresColumns()}
            values={features}
            onChangeData={handleChangeData}
            onDeleteRow={handleRemoveRow}
            actions={[]}
          />
        )}
      </Box>
    </CardSecondary>
  );
};

export default StatisticsFeaturesForm;

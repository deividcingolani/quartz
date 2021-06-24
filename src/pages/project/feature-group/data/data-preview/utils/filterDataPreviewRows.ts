import { Feature } from '../../../../../../types/feature';
import { ComputedData } from '../../../../../../types/feature-group-data-preview';

const filterDataPreviewRows = (
  features: Feature[],
  computedData: ComputedData[],
): ComputedData[] => {
  return computedData.map((row) => {
    return {
      ...row,
      row: row.row.filter(({ columnName }) =>
        features.map((f) => f.name).includes(columnName),
      ),
    };
  });
};

export default filterDataPreviewRows;

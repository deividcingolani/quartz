import { Feature } from '../../../../../../types/feature-group';
import { ComputedData } from '../../../../../../types/feature-group-data-preview';
import { FeatureGroupRowsState } from '../../../../../../store/models/feature/statistics/featureGroupRows.model';

const createDataPreviewRows = (
  features: Feature[],
  data: FeatureGroupRowsState,
): ComputedData[] => {
  const [firstDataItem = []] = Object.values(data);

  return firstDataItem.map((_, index) => ({
    type: 'previewDTO',
    row: features.map(({ name, primary, partition }) => ({
      columnName: name,
      columnValue: data[name][index],
      isPrimary: primary,
      isPartition: partition,
    })),
  }));
};

export default createDataPreviewRows;

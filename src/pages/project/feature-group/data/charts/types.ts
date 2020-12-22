import { HistogramItem } from '../../../../../types/feature-group';
import { ItemDrawerTypes } from '../../../../../components/drawer/ItemDrawer';

export interface ChartProps {
  data: HistogramItem[];
  dataType: ItemDrawerTypes;
}

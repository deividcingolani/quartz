import { SearchState } from '../../../store/models/search/search.model';
import { FeatureGroup } from '../../../types/feature-group';
import { TrainingDataset } from '../../../types/training-dataset';
import { DataEntity } from '../../../types';

const includes = (item: FeatureGroup | TrainingDataset, search: string) => {
  return item.name.includes(search);
};

const getEntityById = <T extends DataEntity>(id: number, entities: T[]) =>
  entities.find(({ id: itemId }) => itemId === +id);

const filterByRecentHistory = (
  data: SearchState,
  history: string[],
  maxRecentLength = 5,
): DataEntity[] => {
  const reversed = history.slice().reverse();

  let matchItems = reversed.reduce((acc: DataEntity[], path) => {
    const [, type, id] = path.match(/(fg|td)\/(\d+)/) || [];

    let item;
    if (type && !acc.find((item) => item?.id === +id)) {
      if (type === 'fg') {
        item = getEntityById(+id, data.featureGroups);
      } else {
        item = getEntityById(+id, data.trainingDatasets);
      }
    }

    if (item) {
      return [...acc, item];
    }

    return acc;
  }, []);

  // maxRecentLength recent
  if (matchItems.length > maxRecentLength) {
    matchItems.splice(0, maxRecentLength);
  }

  return matchItems;
};

const filterResult = (
  data: SearchState,
  search: string,
  history: string[],
): DataEntity[] => {
  if (!search) {
    return filterByRecentHistory(data, history);
  }

  return Object.values({
    trainingDatasets: data.trainingDatasets?.filter((td) =>
      includes(td, search),
    ),
    featureGroups: data.featureGroups?.filter((fg) => includes(fg, search)),
  }).reduce((acc: DataEntity[], value) => [...acc, ...value], []);
};

export const cropResult = (
  data: DataEntity[],
  maxLength = 10,
): DataEntity[] => {
  if (data.length > maxLength) {
    data.splice(0, maxLength);
  }

  return data;
};

export default filterResult;

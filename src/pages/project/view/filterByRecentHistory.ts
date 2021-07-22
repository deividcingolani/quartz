import { ShortcutItem } from '../../../services/localStorage/ShortcutsService';
import { SearchState } from '../../../store/models/search/search.model';

const getEntityById = <T extends ShortcutItem>(id: number, entities: T[]) =>
  entities.find(({ id: itemId }) => itemId === id);

const filterByRecentHistory = (
  projectId: number,
  data: SearchState,
  history: string[],
): ShortcutItem[] => {
  const reversed = history.slice().reverse();
  const matchItems = reversed.reduce((acc: ShortcutItem[], path) => {
    const [, , pId, type, id] = path.match(/(p)\/(\d+)\/(fg|td)\/(\d+)/) || [];

    let item;
    if (type && projectId === +pId && !getEntityById(+id, acc)) {
      if (type === 'fg') {
        item = getEntityById(+id, data.featureGroups);
      } else {
        item = getEntityById(+id, data.trainingDatasets);
      }
    }

    const reducedItem = item && {
      id: item.id,
      name: item.name,
      type: item.type,
    };

    return reducedItem ? [...acc, reducedItem] : acc;
  }, []);

  return matchItems;
};

export default filterByRecentHistory;

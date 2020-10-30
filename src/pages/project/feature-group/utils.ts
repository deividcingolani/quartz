import { FeatureGroup } from '../../../types/feature-group';

// Filter
export const filterFG = (
  data: FeatureGroup[],
  filter: string[],
): FeatureGroup[] => {
  if (filter.length) {
    return data.filter(({ labels }) => filter.some((f) => labels?.includes(f)));
  }
  return data;
};

// Sort
export type FGSortFunction = (fg1: FeatureGroup, fg2: FeatureGroup) => number;

interface SortParams {
  [key: string]: FGSortFunction;
}

export const sortOptions: SortParams = {
  'creation date': ({ created: c1 }, { created: c2 }) => {
    const time1 = new Date(c1).getTime();
    const time2 = new Date(c2).getTime();

    if (time1 === time2) {
      return 0;
    }

    return time1 < time2 ? 1 : -1;
  },
  name: ({ name: n1 }, { name: n2 }) => n1.localeCompare(n2),
};

export const sortFG = (data: FeatureGroup[], sort: string): FeatureGroup[] => {
  const sortFunction = sortOptions[sort];

  return sortFunction ? data.sort(sortFunction) : data;
};

export const searchFGText = (
  data: FeatureGroup[],
  text: string,
): FeatureGroup[] =>
  !text
    ? data
    : data.filter(({ name, id }) =>
        JSON.stringify({ name, id }).toLowerCase().includes(text.toLowerCase()),
      );

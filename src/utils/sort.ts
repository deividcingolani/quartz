export type SortFunc<T> = (a: T[keyof T], b: T[keyof T]) => number;

export enum SortDirection {
  asc,
  desc,
}

const sortString: SortFunc<any> = (a, b) => a.localeCompare(b);
const sortNumber: SortFunc<any> = (a, b) => {
  if (a === b) {
    return 0;
  }

  return a < b ? 1 : -1;
};
const sortDate: SortFunc<any> = (a, b) => {
  const time1 = new Date(a).getTime();
  const time2 = new Date(b).getTime();

  return sortNumber(time1, time2);
};

const sort = <T>(
  key?: keyof T,
  sortFunc: SortFunc<T> = sortString,
  direction: SortDirection = SortDirection.asc,
) => (data: T[]): T[] => {
  if (!key) {
    return data;
  }

  const result = data.sort(({ [key]: a }, { [key]: b }) => sortFunc(a, b));

  if (direction === SortDirection.desc) {
    return result.reverse();
  }
  return result;
};

sort.string = sortString;
sort.number = sortNumber;
sort.date = sortDate;

export default sort;

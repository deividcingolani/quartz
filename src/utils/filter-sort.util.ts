export const filterFn = <T>(filter: string[], key: keyof T) => (data: T[]) => {
  return filter.length
    ? data.filter(({ [key]: labels }: T) =>
        filter.some((f) => String(labels).includes(f)),
      )
    : data;
};

export const sortFn = (sortOptions: { [key: string]: any }, sort: string) => <
  T
>(
  data: T[],
): T[] => {
  const sortFunction = sortOptions[sort];

  if (sortFunction) {
    return data.sort(sortFunction);
  }

  return data;
};

export const searchTextFn = (text: string) => <T>(data: T[]): T[] => {
  return !text
    ? data
    : data.filter(({ name, id }: any) =>
        JSON.stringify({ name, id }).toLowerCase().includes(text.toLowerCase()),
      );
};

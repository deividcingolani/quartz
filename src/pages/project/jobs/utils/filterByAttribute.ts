export const filterByAttribute = <T>(
  data: T[],
  filter: any,
  key: keyof T,
): T[] => {
  return data.filter(({ [key]: value }) => {
    if (Array.isArray(filter)) {
      return filter.length ? filter.includes(value) : data;
    }
    return filter === value;
  });
};

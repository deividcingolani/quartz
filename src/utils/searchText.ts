const searchText = (text: string) => <T>(data: T[]): T[] => {
  return !text
    ? data
    : data.filter(({ name, id }: any) =>
        JSON.stringify({ name, id }).toLowerCase().includes(text.toLowerCase()),
      );
};

export default searchText;

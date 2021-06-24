const filter =
  <T>(filtr: string[], key: keyof T) =>
  (data: T[]) => {
    return filtr.length
      ? data.filter(({ [key]: labels }: T) =>
          filtr.some((f) => String(labels).includes(f)),
        )
      : data;
  };

export default filter;

export interface Paginate<T> {
  data: T[];
  totalPages: number;
}

const paginate = <T>(data: T[], page: number, limit = 0): Paginate<T> => {
  const dataLength = data.length;
  const validLimit = limit && limit < dataLength ? limit : dataLength;
  const currentSliceIndex = validLimit * page;

  return {
    data: data.slice(
      currentSliceIndex - validLimit,
      currentSliceIndex > dataLength ? dataLength : currentSliceIndex,
    ),
    totalPages: dataLength ? Math.ceil(dataLength / validLimit) : 1,
  };
};

export default paginate;

import React, { useCallback, useMemo, useState } from 'react';
import { Jobs } from '../../../../types/jobs';
import filterByAttribute from '../utils/filterByAttribute';

export interface UseJobsFilters {
  dataFiltered: Jobs[];
  types: string[];

  search: string;
  typeFilters: string[];

  onTypeFiltersChange: (filters: string[]) => void;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}

const useJobsFilter = (data: Jobs[], initialSearch = ''): UseJobsFilters => {
  // State
  const [search, setSearch] = useState<string>(initialSearch);
  const [typeFilters, onTypeFiltersChange] = useState<string[]>([]);

  // Handlers
  const onSearchChange = useCallback(
    ({ target }) => {
      setSearch(target.value);
    },
    [setSearch],
  );

  const onReset = useCallback(() => {
    setSearch('');
    onTypeFiltersChange([]);
  }, []);

  // Data
  const typeFilterOptions = useMemo(
    () => Array.from(new Set(data.map(({ jobType }) => jobType))),
    [data],
  );

  const dataFiltered = useMemo<Jobs[]>(() => {
    let result = data;
    result = filterByAttribute<Jobs>(result, typeFilters, 'jobType').filter(
      ({ name }) => name.toLowerCase().includes(search.toLowerCase()),
    );
    return result;
  }, [data, search, typeFilters]);

  return useMemo(
    () => ({
      dataFiltered,
      types: typeFilterOptions,
      search,
      typeFilters,

      onTypeFiltersChange,
      onSearchChange,
      onReset,
    }),
    [
      dataFiltered,
      typeFilterOptions,
      search,
      typeFilters,

      onTypeFiltersChange,
      onSearchChange,
      onReset,
    ],
  );
};

export default useJobsFilter;

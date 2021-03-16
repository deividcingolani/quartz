import React, { useCallback, useMemo, useState } from 'react';
import { Feature } from '../../../../types/feature-group';
import filterByAttribute from '../overview/utils';

export enum KeyFilters {
  'primary',
  'partition',
  'label',
  null,
}

export interface UseFeatureFilters {
  dataFiltered: Feature[];
  types: string[];

  search: string;
  typeFilters: string[];
  keyFilter: KeyFilters;

  onTypeFiltersChange: (filters: string[]) => void;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleKey: (key: KeyFilters) => () => void;
  onReset: () => void;
}

const useFeatureFilter = (
  data: Feature[],
  initialSearch = '',
): UseFeatureFilters => {
  // State
  const [search, setSearch] = useState<string>(initialSearch);
  const [typeFilters, onTypeFiltersChange] = useState<string[]>(
    Array.from(new Set(data.map(({ type }) => type))),
  );
  const [keyFilter, setKeyFilter] = useState<KeyFilters>(KeyFilters.null);

  // Handlers
  const onSearchChange = useCallback(
    ({ target }) => {
      setSearch(target.value);
    },
    [setSearch],
  );

  const onToggleKey = useCallback(
    (key: KeyFilters) => (): void => {
      setKeyFilter((current) => (current === key ? KeyFilters.null : key));
    },
    [setKeyFilter],
  );

  const onReset = useCallback(() => {
    setSearch('');
    onTypeFiltersChange([]);
    setKeyFilter(KeyFilters.null);
  }, []);

  // Data
  const typeFilterOptions = useMemo(
    () => Array.from(new Set(data.map(({ type }) => type))),
    [data],
  );

  const dataFiltered = useMemo<Feature[]>(() => {
    let result = data;

    if (keyFilter === KeyFilters.partition) {
      result = filterByAttribute<Feature>(result, true, 'partition');
    }

    if (keyFilter === KeyFilters.primary) {
      result = filterByAttribute<Feature>(result, true, 'primary');
    }

    if (keyFilter === KeyFilters.label) {
      result = filterByAttribute<Feature>(result, true, 'label');
    }

    result = filterByAttribute<Feature>(
      result,
      typeFilters,
      'type',
    ).filter(({ name }) => name.toLowerCase().includes(search.toLowerCase()));

    return result;
  }, [data, search, keyFilter, typeFilters]);

  return useMemo(
    () => ({
      dataFiltered,
      types: typeFilterOptions,
      search,
      typeFilters,
      keyFilter,

      onTypeFiltersChange,
      onSearchChange,
      onToggleKey,
      onReset,
    }),
    [
      dataFiltered,
      typeFilterOptions,
      search,
      typeFilters,
      keyFilter,

      onTypeFiltersChange,
      onSearchChange,
      onToggleKey,
      onReset,
    ],
  );
};

export default useFeatureFilter;

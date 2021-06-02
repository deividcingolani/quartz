import React, { useCallback, useMemo, useState } from 'react';
import { Feature } from '../../../../types/feature-group';
import filterByAttribute from '../overview/utils';

export enum KeyFilters {
  'primary',
  'partition',
  'label',
  'type',
  'onlineType',
  null,
}

export interface UseFeatureFilters {
  dataFiltered: Feature[];
  types: string[];
  onlineTypes: string[];

  search: string;
  typeFilters: string[];
  onlineTypeFilters: string[];
  keyFilter: KeyFilters;

  onTypeFiltersChange: (filters: string[]) => void;
  onOnlineTypeFiltersChange: (filters: string[]) => void;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleKey: (key: KeyFilters) => () => void;
  onReset: () => void;
}

const useFeatureFilter = (
  data: Feature[],
  initialSearch = '',
  onlineEnabled = false,
): UseFeatureFilters => {
  // State
  const [search, setSearch] = useState<string>(initialSearch);
  const [typeFilters, onTypeFiltersChange] = useState<string[]>([]);
  const [onlineTypeFilters, onOnlineTypeFiltersChange] = useState<string[]>([]);
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
    onOnlineTypeFiltersChange([]);
    setKeyFilter(KeyFilters.null);
  }, []);

  // Data
  const typeFilterOptions = useMemo(() => {
    const offlineTypes = Array.from(new Set(data.map(({ type }) => type)));
    let onlineTypes: string[] = [];

    if (onlineEnabled) {
      onlineTypes = Array.from(
        new Set(data.map(({ onlineType }) => onlineType)),
      ) as string[];
    }

    return {
      offlineTypes,
      onlineTypes,
    };
    // eslint-disable-next-line
  }, [data]);

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

    result = filterByAttribute<Feature>(result, typeFilters, 'type');

    result = filterByAttribute<Feature>(
      result,
      onlineTypeFilters,
      'onlineType',
    );

    result.filter(({ name }) =>
      name.toLowerCase().includes(search.toLowerCase()),
    );

    return result;
  }, [data, search, keyFilter, typeFilters, onlineTypeFilters]);

  return useMemo(
    () => ({
      dataFiltered,
      types: typeFilterOptions.offlineTypes,
      onlineTypes: typeFilterOptions.onlineTypes,
      search,
      typeFilters,
      onlineTypeFilters,
      keyFilter,

      onTypeFiltersChange,
      onOnlineTypeFiltersChange,
      onSearchChange,
      onToggleKey,
      onReset,
    }),
    // eslint-disable-next-line
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

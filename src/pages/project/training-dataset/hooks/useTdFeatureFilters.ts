import { useCallback, useMemo, useState } from 'react';
import filterByAttribute from '../../feature-group/overview/utils';
import { Feature } from '../../../../types/feature-group';

export enum TdKeyFilters {
  'label',
  null,
}

export interface UseTdFeatureFilters {
  dataFiltered: Feature[];

  types: string[];
  fgFilterOptions: string[];
  search: string;
  typeFilters: string[];
  fgFilters: string[];
  keyFilter: TdKeyFilters;

  onTypeFiltersChange: (filters: string[]) => void;
  onFgFiltersChange: (filters: string[]) => void;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleKey: (key: TdKeyFilters) => () => void;
  onReset: () => void;
}

const useTdFeatureFilter = (
  data: Feature[],
  initialSearch = '',
): UseTdFeatureFilters => {
  const [search, setSearch] = useState<string>(initialSearch);
  const [typeFilters, onTypeFiltersChange] = useState<string[]>(
    Array.from(new Set(data.map(({ type }) => type))),
  );
  const [fgFilters, onFgFiltersChange] = useState<string[]>(
    data[0] && data[0].featuregroup
      ? Array.from(
          new Set(
            data.map(
              ({ featuregroup }) =>
                `${featuregroup.name} v${featuregroup.version}`,
            ),
          ),
        )
      : [],
  );
  const [keyFilter, setKeyFilter] = useState(TdKeyFilters.null);

  const onSearchChange = useCallback(
    ({ target }) => {
      setSearch(target.value);
    },
    [setSearch],
  );

  const onToggleKey = useCallback(
    (key: TdKeyFilters) => (): void => {
      setKeyFilter((current) => (current === key ? TdKeyFilters.null : key));
    },
    [setKeyFilter],
  );

  const onReset = useCallback(() => {
    setSearch('');
    setKeyFilter(TdKeyFilters.null);
  }, []);

  const typeFilterOptions = useMemo(
    () => Array.from(new Set(data.map(({ type }) => type))),
    [data],
  );

  const fgFilterOptions = useMemo(() => {
    if (data[0]?.featuregroup) {
      return Array.from(
        new Set(
          data.map(
            ({ featuregroup }) =>
              `${featuregroup.name} v${featuregroup.version}`,
          ),
        ),
      );
    }
    return [];
  }, [data]);

  const dataFiltered = useMemo<Feature[]>(() => {
    let result = data;

    if (keyFilter === TdKeyFilters.label) {
      result = filterByAttribute<Feature>(result, true, 'label');
    }

    result = filterByAttribute<Feature>(result, typeFilters, 'type');

    result = result.filter(({ featuregroup }) => {
      return fgFilters.length
        ? fgFilters.includes(`${featuregroup.name} v${featuregroup.version}`)
        : data;
    });

    return result.filter(({ name }) =>
      name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search, keyFilter, typeFilters, fgFilters]);

  return useMemo(
    () => ({
      dataFiltered,
      types: typeFilterOptions,
      fgFilterOptions,
      search,
      typeFilters,
      fgFilters,
      keyFilter,

      onTypeFiltersChange,
      onFgFiltersChange,
      onSearchChange,
      onToggleKey,
      onReset,
    }),
    [
      dataFiltered,
      typeFilterOptions,
      fgFilterOptions,
      search,
      typeFilters,
      fgFilters,
      keyFilter,

      onTypeFiltersChange,
      onFgFiltersChange,
      onSearchChange,
      onToggleKey,
      onReset,
    ],
  );
};

export default useTdFeatureFilter;

import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';

// Types
import { Dispatch, RootState } from '../../../store';
// Selectors
import { selectDeepSearchCountState } from '../../../store/models/search/search.selectors';
import useQueryParams from './useQueryParams';
import { getFilteredCount } from '../utils/getMatches';

interface FilteredData {
  featureGroups: number;
  trainingDatasets: number;
  features: number;
}

const useSearchDataCount = (
  projectId: number | null,
  initialSearch: string,
) => {
  const dispatch = useDispatch<Dispatch>();
  const queryParams = useQueryParams();
  const data = useSelector(selectDeepSearchCountState);
  const [filteredData, setFilteredData] = useState<FilteredData>();

  const isLoading = useSelector(
    (state: RootState) =>
      state.loading.effects.deepSearch.fetchCountFromProject ||
      state.loading.effects.deepSearch.fetchCount,
  );

  const requestData = useCallback(
    (search: string) => {
      if (search) {
        if (projectId) {
          dispatch.deepSearch.fetchCountFromProject({
            projectId: +projectId,
            search,
          });
        } else {
          dispatch.deepSearch.fetchCount({
            search,
          });
        }
      }
    },
    [dispatch, projectId],
  );

  useEffect(() => {
    requestData(initialSearch);
  }, [projectId, initialSearch, requestData]);

  useEffect(() => {
    if (Object.entries(data as any).length === 0) return;
    const filtered = getFilteredCount(data);
    setFilteredData(filtered);
  }, [data, queryParams]);

  return {
    data: filteredData,
    isLoading,
  };
};

export default useSearchDataCount;

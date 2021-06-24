import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo } from 'react';

// Types
import SearchTypes from '../types';
import { Dispatch, RootState } from '../../../store';
// Selectors
import {
  selectDeepSearchFeatureGroupsState,
  selectDeepSearchFeaturesState,
  selectDeepSearchTrainingDatasetsState,
} from '../../../store/models/search/search.selectors';

const useSearchData = (
  projectId: number,
  type: SearchTypes,
  initialSearch: string,
) => {
  const dispatch = useDispatch<Dispatch>();

  const dataSelector = useMemo(() => {
    switch (type) {
      case SearchTypes.feature:
        return selectDeepSearchFeaturesState;
      case SearchTypes.fg:
        return selectDeepSearchFeatureGroupsState;
      default:
        return selectDeepSearchTrainingDatasetsState;
    }
  }, [type]);

  const data = useSelector<any>(dataSelector);

  const isDataLoading = useSelector(
    (state: RootState) =>
      state.loading.effects.deepSearch.fetchType ||
      state.loading.effects.deepSearch.fetchTypeFromProject,
  );

  const isKeywordsAndLastUpdateLoading = useSelector(
    (state: RootState) =>
      state.loading.effects.deepSearch.fetchKeywordsAndLastUpdate,
  );

  const requestData = useCallback(
    (search: string) => {
      if (search) {
        if (projectId) {
          dispatch.deepSearch.fetchTypeFromProject({
            projectId: +projectId,
            search,
            type,
          });
        } else {
          dispatch.deepSearch.fetchType({
            projectId: +projectId,
            search,
            type,
          });
        }
      }
    },
    [dispatch, projectId, type],
  );

  const handleSearch = useCallback(
    (search: string) => {
      requestData(search);
    },
    [requestData],
  );

  useEffect(() => {
    requestData(initialSearch);
  }, [projectId, initialSearch, requestData]);

  return {
    data,
    isKeywordsAndLastUpdateLoading,
    isDataLoading,
    handleSearch,
  };
};

export default useSearchData;

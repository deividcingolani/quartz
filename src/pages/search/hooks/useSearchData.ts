import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo } from 'react';

// Types
import { SearchTypes } from '../types';
import { Dispatch } from '../../../store';
// Selectors
import {
  selectDeepSearchFeatureGroupsState,
  selectDeepSearchFeaturesState,
  selectDeepSearchLoading,
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
    }
    return selectDeepSearchTrainingDatasetsState;
  }, [type]);

  const data = useSelector<any>(dataSelector);

  const isLoading = useSelector(selectDeepSearchLoading);

  const requestData = useCallback(
    (search: string) => {
      if (search) {
        if (projectId) {
          dispatch.deepSearch.fetchTypePromProject({
            projectId: +projectId,
            search,
            type,
          });
        } else {
          dispatch.deepSearch.fetchType({
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
    isLoading,
    handleSearch,
  };
};

export default useSearchData;

import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Dispatch } from '../../store';
import { selectFeatureStoreData } from '../../store/models/feature/selectors';
import { selectSearchState } from '../../store/models/search/search.selectors';
import useLoadAfterOther from '../../hooks/useLoadAfterOther';

const useSearchData = () => {
  const { id: projectId } = useParams();

  const data = useSelector(selectSearchState);

  const location = useLocation();
  const { data: featureStoreData } = useSelector(selectFeatureStoreData);

  const dispatch = useDispatch<Dispatch>();

  const { loadAfterAll } = useLoadAfterOther();

  useEffect(() => {
    if (featureStoreData?.featurestoreId && projectId) {
      if (location.pathname.indexOf('fg') === location.pathname.length - 2) {
        loadAfterAll(() =>
          dispatch.search.fetchTd({
            projectId: +projectId,
            featureStoreId: featureStoreData.featurestoreId,
          }),
        );
      } else if (
        location.pathname.indexOf('td') ===
        location.pathname.length - 2
      ) {
        loadAfterAll(() =>
          dispatch.search.fetchFg({
            projectId: +projectId,
            featureStoreId: featureStoreData.featurestoreId,
          }),
        );
      } else {
        loadAfterAll(() =>
          dispatch.search.fetch({
            projectId: +projectId,
            featureStoreId: featureStoreData.featurestoreId,
          }),
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, featureStoreData, projectId]);

  return { data };
};

export default useSearchData;

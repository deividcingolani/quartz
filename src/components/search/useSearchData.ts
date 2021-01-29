import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Dispatch } from '../../store';
import { selectFeatureStoreData } from '../../store/models/feature/selectors';
import { selectSearchState } from '../../store/models/search/search.selectors';

const useSearchData = () => {
  const { id: projectId } = useParams();

  const data = useSelector(selectSearchState);
  const { data: featureStoreData } = useSelector(selectFeatureStoreData);

  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    if (featureStoreData?.featurestoreId && projectId) {
      dispatch.search.fetch({
        projectId: +projectId,
        featureStoreId: featureStoreData.featurestoreId,
      });
    }
  }, [dispatch, featureStoreData, projectId]);

  return { data };
};

export default useSearchData;

import { selectFeatureStoreData } from '../../store/models/feature/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from '../../store';
import { useEffect } from 'react';
import { selectSearchState } from '../../store/models/search/search.selectors';
import { useLocation, useParams } from 'react-router-dom';

const useSearchData = () => {
  const { id: projectId } = useParams();

  const data = useSelector(selectSearchState);
  const { data: featureStoreData } = useSelector(selectFeatureStoreData);

  const location = useLocation();
  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    if (featureStoreData?.featurestoreId && projectId) {
      dispatch.search.fetch({
        projectId: +projectId,
        featureStoreId: featureStoreData.featurestoreId,
      });
    }
  }, [dispatch, location.pathname, featureStoreData, projectId]);

  return { data };
};

export default useSearchData;

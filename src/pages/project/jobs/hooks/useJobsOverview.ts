import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch, RootState } from '../../../../store';

//Types
import { FeatureGroupViewState } from '../../../../store/models/feature/featureGroupView.model';

export interface useJobsOverview {
  data: FeatureGroupViewState;
  isLoading: boolean;
}

const useJobsOverview = (
  projectId: number,
  jobsName: string,
): useJobsOverview => {
  const isLoading = useSelector(
    (state: RootState) => state.loading.effects.jobsView.fetch,
  );

  const data = useSelector<RootState, FeatureGroupViewState>(
    (state) => state.featureGroupView,
  );

  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    if (projectId && jobsName) {
      dispatch.jobsView.fetch({ projectId: projectId, jobsName: jobsName });
    }
  }, [jobsName, projectId]);
  return {
    data,
    isLoading,
  };
};

export default useJobsOverview;

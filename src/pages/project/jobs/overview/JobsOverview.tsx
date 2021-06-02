import React, { useCallback, useEffect } from 'react';
import { Box } from 'rebass';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useJobs from '../list/useJobs';
import { RootState } from '../../../../store';
import routeNames from '../../../../routes/routeNames';
import OverviewContent from './OverviewContent';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import Loader from '../../../../components/loader/Loader';
import useTitle from '../../../../hooks/useTitle';

const JobsOverview = () => {
  const { id: projectId, jobId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigateRelative();

  const handleNavigate = useCallback(
    (id: number, route: string) => (): void => {
      navigate(route.replace(':jobId', String(id)), routeNames.project.view);
    },
    [navigate],
  );

  const { data } = useJobs(+projectId);
  useEffect(() => {
    const item = data.find((jobs) => jobs.id === +jobId);
    if (projectId && item) {
      dispatch.jobsView.fetch({ projectId: projectId, jobsName: item.name });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const jobData = useSelector((state: RootState) => state.jobsView);
  useTitle(jobData?.name);

  const handleRefresh = useCallback(() => {
    if (jobData) {
      dispatch.jobsView.fetch({ projectId: projectId, jobsName: jobData.name });
    }
  }, [dispatch, projectId, jobData]);

  const isLoading = useSelector(
    (state: RootState) => state.loading.effects.jobsView.fetch,
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Box
        display="grid"
        sx={{
          gridTemplateRows: '130px 50px minmax(120px, 100%)',
          height: 'calc(100vh - 115px)',
        }}
      >
        {jobData && (
          <OverviewContent
            data={jobData}
            onClickEdit={handleNavigate(+jobId, routeNames.jobs.edit)}
            onClickRefresh={handleRefresh}
          />
        )}
      </Box>
    </>
  );
};

export default JobsOverview;

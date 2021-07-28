// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useEffect } from 'react';
// Components
import {
  NotificationsManager,
  TinyPopup,
  usePopup,
} from '@logicalclocks/quartz';
// Hooks
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import useTitle from '../../../../hooks/useTitle';
// Types
import { RootState } from '../../../../store';
import { JobsViewState } from '../../../../store/models/jobs/jobsView.model';
import { JobsConfig } from '../../../../types/jobs';
// layouts
import JobsForm from '../form/JobsForm';
// Utils
import titles from '../../../../sources/titles';
import NotificationTitle from '../../../../utils/notifications/notificationBadge';
import NotificationContent from '../../../../utils/notifications/notificationValue';

const JobsEdit: FC = () => {
  const { id: projectId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigateRelative();

  const item = useSelector<RootState, JobsViewState>((state) => state.jobsView);

  const isDeleting = useSelector(
    (state: RootState) => state.loading.effects.jobsView.delete,
  );

  const isLoadingJobs = useSelector(
    (state: RootState) => state.loading.effects.jobs.fetch,
  );

  useTitle(`${titles.editJob} ${item?.name}`);

  const [isPopupOpen, handleToggle] = usePopup();

  useEffect(() => {
    if (projectId && item) {
      dispatch.jobsView.fetch({ projectId, jobsName: item.name });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const handleUpdateSubmit = useCallback(
    async (data: JobsConfig) => {
      const id = await dispatch.jobs.update({
        projectId: +projectId,
        data,
        oldName: !!item && item.name,
      });

      if (id) {
        dispatch.jobsView.fetch({
          projectId: +projectId,
          jobsName: data.appName,
        });

        navigate(`/jobs/${id}`, 'p/:id/*');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projectId],
  );

  const handleDelete = useCallback(async () => {
    if (item) {
      await dispatch.jobsView.delete({
        projectId: +projectId,
        jobName: item.name,
      });

      handleToggle();
      navigate('/jobs', 'p/:id/*');

      await dispatch.jobs.fetch({
        projectId: +projectId,
      });

      NotificationsManager.create({
        isError: false,
        type: <NotificationTitle message="Job deleted" />,
        content: (
          <NotificationContent message={`${item.name} has been deleted`} />
        ),
      });
    }
  }, [
    item,
    dispatch.jobsView,
    dispatch.jobs,
    projectId,
    handleToggle,
    navigate,
  ]);

  const isFeatureStoreLoading = useSelector(
    (state: RootState) => state.loading.effects.featureStores.fetch,
  );
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const isSubmit = useSelector(
    (state: RootState) => state.loading.effects.jobs.edit,
  );

  return (
    <>
      {item && (
        <JobsForm
          isLoading={isFeatureStoreLoading}
          isDisabled={isSubmit}
          isEdit
          initialData={item}
          onDelete={handleToggle}
          submitHandler={handleUpdateSubmit}
        />
      )}
      <TinyPopup
        width="440px"
        title={`Delete ${item?.name}`}
        secondaryText="Once you delete a job, there is no going back. Please be certain."
        isOpen={isPopupOpen}
        mainButton={['Delete job', handleDelete]}
        secondaryButton={['Back', handleToggle]}
        disabledMainButton={isDeleting || isLoadingJobs}
        disabledSecondaryButton={isDeleting || isLoadingJobs}
        onClose={handleToggle}
      />
    </>
  );
};

export default JobsEdit;

// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC } from 'react';
import { Flex } from 'rebass';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import JobsForm from '../form/JobsForm';
import { RootState } from '../../../../store';
import useTitle from '../../../../hooks/useTitle';
import titles from '../../../../sources/titles';
import { JobsConfig } from '../../../../types/jobs';
import getHrefNoMatching from '../../../../utils/getHrefNoMatching';
import routeNames from '../../../../routes/routeNames';

const JobsCreate: FC = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  useTitle(titles.createJob);

  const dispatch = useDispatch();

  const isFeatureStoreLoading = useSelector(
    (state: RootState) => state.loading.effects.featureStores.fetch,
  );

  const isSubmit = useSelector(
    (state: RootState) => state.loading.effects.jobs.create,
  );

  const handleSubmit = async (data: JobsConfig) => {
    const jobId = await dispatch.jobs.create({
      projectId: +projectId,
      data,
    });

    if (jobId) {
      dispatch.jobsView.fetch({
        projectId: +projectId,
        jobsName: data.appName,
      });

      navigate(
        getHrefNoMatching(
          routeNames.jobs.overview,
          routeNames.project.value,
          true,
          {
            id: projectId,
            jobId,
          },
        ),
      );
    }
  };

  return (
    <Flex flexDirection="column">
      <JobsForm
        isLoading={isFeatureStoreLoading}
        isDisabled={isSubmit}
        submitHandler={handleSubmit}
      />
    </Flex>
  );
};

export default JobsCreate;

// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC } from 'react';
import { Flex } from 'rebass';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import JobsForm from '../form/JobsForm';
import { RootState } from '../../../../store';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import useTitle from '../../../../hooks/useTitle';
import titles from '../../../../sources/titles';
import { JobsConfig } from '../../../../types/jobs';

const JobsCreate: FC = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigateRelative();
  useTitle(titles.createJob);

  const dispatch = useDispatch();

  const isFeatureStoreLoading = useSelector(
    (state: RootState) => state.loading.effects.featureStores.fetch,
  );

  const isSubmit = useSelector(
    (state: RootState) => state.loading.effects.jobs.create,
  );

  const handleSubmit = async (data: JobsConfig) => {
    const id = await dispatch.jobs.create({
      projectId: +projectId,
      data,
    });

    if (id) {
      dispatch.jobsView.fetch({
        projectId: +projectId,
        jobsName: data.appName,
      });

      navigate(`/jobs/${id}`, 'p/:id/*');
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

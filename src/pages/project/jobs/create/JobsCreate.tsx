import React, { FC } from 'react';
import { Flex } from 'rebass';
import JobsForm from '../form/JobsForm';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { DynamicAllocation, JobFormData } from '../types';
import { useParams } from 'react-router-dom';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import { formatted } from '../utils/formattedRequest';
import useTitle from '../../../../hooks/useTitle';
import titles from '../../../../sources/titles';

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

  const handleSubmit = async (
    data: JobFormData,
    activeApp: any,
    additional: any,
  ) => {
    const isObject = (val: any) => val instanceof Object;
    const isDynamic: boolean =
      data.dynamicAllocation === DynamicAllocation.DYNAMIC;
    const req: any = {
      ...formatted(data),
      'spark.dynamicAllocation.enabled': isDynamic,
      'spark.yarn.dist.pyFiles': additional ? additional.phyton.join(',') : '',
      'spark.yarn.dist.archives': additional
        ? additional.archives.join(',')
        : '',
      'spark.yarn.dist.jars': additional ? additional.jars.join(',') : '',
      'spark.yarn.dist.files': additional ? additional.files.join(',') : '',
      appPath: isObject(activeApp)
        ? `hdfs://${activeApp.path}/${activeApp.name}`
        : `hdfs://${activeApp}`,
      type: 'sparkJobConfiguration',
      mainClass: 'io.hops.examples.featurestore_tour.Main',
    };
    delete req.dynamicAllocation;
    const id = await dispatch.jobs.create({
      projectId: +projectId,
      data: req,
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

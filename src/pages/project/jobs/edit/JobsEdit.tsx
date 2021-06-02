import React, { FC, useCallback, useEffect } from 'react';
import { Flex } from 'rebass';
import JobsForm from '../form/JobsForm';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { useParams } from 'react-router-dom';
import { JobsViewState } from '../../../../store/models/jobs/jobsView.model';
import { DynamicAllocation, JobFormData } from '../types';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import { formatted } from '../utils/formattedRequest';
import useTitle from '../../../../hooks/useTitle';
import titles from '../../../../sources/titles';

const JobsEdit: FC = () => {
  const { id: projectId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigateRelative();

  const item = useSelector<RootState, JobsViewState>((state) => state.jobsView);

  useTitle(`${titles.editJob} ${item?.name}`);

  useEffect(() => {
    if (projectId && item) {
      dispatch.jobsView.fetch({ projectId: projectId, jobsName: item.name });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const handleUpdateSubmit = useCallback(
    async (data: JobFormData, activeApp: any, additional: any) => {
      const isDynamic: boolean =
        data.dynamicAllocation === DynamicAllocation.DYNAMIC;
      const req: any = {
        ...formatted(data),
        type: 'sparkJobConfiguration',
        mainClass: 'io.hops.examples.featurestore_tour.Main',
        'spark.dynamicAllocation.enabled': isDynamic,
        'spark.yarn.dist.pyFiles': additional
          ? additional.phyton.join(',')
          : '',
        'spark.yarn.dist.archives': additional
          ? additional.archives.join(',')
          : '',
        'spark.yarn.dist.jars': additional ? additional.jars.join(',') : '',
        'spark.yarn.dist.files': additional ? additional.files.join(',') : '',
        appPath: `hdfs://${activeApp.path}/${activeApp.name}`,
      };
      delete req.dynamicAllocation;
      const id = await dispatch.jobs.update({
        projectId: +projectId,
        data: req,
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

  const isFeatureStoreLoading = useSelector(
    (state: RootState) => state.loading.effects.featureStores.fetch,
  );
  //@ts-ignore
  const isSubmit = useSelector(
    (state: RootState) => state.loading.effects.jobs.edit,
  );

  return (
    <Flex flexDirection="column">
      {item && (
        <JobsForm
          isLoading={isFeatureStoreLoading}
          isDisabled={isSubmit}
          isEdit
          initialData={item}
          submitHandler={handleUpdateSubmit}
        />
      )}
    </Flex>
  );
};

export default JobsEdit;

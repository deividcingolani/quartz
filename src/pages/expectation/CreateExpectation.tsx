// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Components
import Loader from '../../components/loader/Loader';
import ExpectationForm from './forms/ExpectationForm';
// Types
import { ExpectationData, ExpectationType } from './types';
import { Dispatch, RootState } from '../../store';
import { FeatureGroupViewState } from '../../store/models/feature/featureGroupView.model';
// Hooks
import useTitle from '../../hooks/useTitle';
// Selectors
import {
  selectExpectationAttachLoading,
  selectExpectationCreateLoading,
  selectExpectationsLoading,
} from '../../store/models/expectations/expectations.selectors';
// Utils
import { mapRules } from './utilts';

import titles from '../../sources/titles';
import getHrefNoMatching from '../../utils/getHrefNoMatching';
import routeNames from '../../routes/routeNames';

const CreateExpectation: FC = () => {
  const { id: projectId, fgId, fsId } = useParams();

  useTitle(titles.expectationAttach);

  const dispatch = useDispatch<Dispatch>();

  const navigate = useNavigate();

  const featureStoreData = useSelector((state: RootState) =>
    state.featureStores?.length ? state.featureStores[0] : null,
  );

  const featureGroup = useSelector<RootState, FeatureGroupViewState>(
    (state) => state.featureGroupView,
  );

  useEffect(() => {
    if (featureStoreData?.featurestoreId && fgId) {
      dispatch.featureGroups.fetch({
        projectId: +projectId,
        featureStoreId: featureStoreData.featurestoreId,
        needMore: false,
      });
      dispatch.featureGroupView.fetch({
        projectId: +projectId,
        featureStoreId: featureStoreData.featurestoreId,
        featureGroupId: +fgId,
        needMore: false,
        needExpectation: true,
      });
      dispatch.expectations.fetch({
        projectId: +projectId,
        featureStoreId: featureStoreData.featurestoreId,
      });
      dispatch.rules.fetch();
    }

    return () => {
      dispatch.expectationView.clear();
    };
  }, [dispatch, projectId, featureStoreData, fgId]);

  const handleSubmit = useCallback(
    async (data: ExpectationData) => {
      if (featureStoreData?.featurestoreId) {
        const { rules, type, ...restData } = data;

        if (type === ExpectationType.new) {
          const expectation = await dispatch.expectations.create({
            featureStoreId: featureStoreData.featurestoreId,
            projectId: +projectId,
            data: { ...restData, rules: mapRules(rules) },
          });

          if (expectation.name) {
            await dispatch.expectations.attach({
              featureGroupId: +fgId,
              featureStoreId: featureStoreData.featurestoreId,
              projectId: +projectId,
              name: expectation.name,
            });

            dispatch.featureGroupView.clear();
            navigate(
              getHrefNoMatching(
                routeNames.featureGroup.overview,
                routeNames.project.value,
                true,
                { id: projectId, fsId, fgId },
              ),
            );
          }
        } else {
          const { expectation } = data;

          if (expectation.length) {
            await dispatch.expectations.attach({
              featureGroupId: +fgId,
              featureStoreId: featureStoreData.featurestoreId,
              projectId: +projectId,
              name: expectation[0],
            });

            dispatch.featureGroupView.clear();
            navigate(
              getHrefNoMatching(
                routeNames.featureGroup.overview,
                routeNames.project.value,
                true,
                { id: projectId, fsId, fgId },
              ),
            );
          }
        }
      }
    },
    [dispatch, featureStoreData, projectId, navigate, fgId, fsId],
  );

  const isSubmit = useSelector(selectExpectationCreateLoading);

  const isAttaching = useSelector(selectExpectationAttachLoading);

  const isExpectationsLoading = useSelector(selectExpectationsLoading);

  if (!featureGroup || isExpectationsLoading) {
    return <Loader />;
  }

  return (
    <ExpectationForm
      onSubmit={handleSubmit}
      isLoading={isSubmit || isAttaching}
      isDisabled={isSubmit || isAttaching}
    />
  );
};

export default CreateExpectation;

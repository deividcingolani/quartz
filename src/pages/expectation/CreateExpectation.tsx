import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { FC, useCallback, useEffect } from 'react';

// Components
import Loader from '../../components/loader/Loader';
import ExpectationForm, { ExpectationType } from './forms/ExpectationForm';
// Types
import { ExpectationData } from './types';
import { Dispatch, RootState } from '../../store';
import { FeatureGroupViewState } from '../../store/models/feature/featureGroupView.model';
// Hooks
import useTitle from '../../hooks/useTitle';
import useNavigateRelative from '../../hooks/useNavigateRelative';
// Selectors
import {
  selectExpectationAttachLoading,
  selectExpectationCreateLoading,
  selectExpectationsLoading,
} from '../../store/models/expectations/expectations.selectors';
// Utils
import { mapRules } from './utilts';

import titles from '../../sources/titles';

const CreateExpectation: FC = () => {
  const { id: projectId, fgId } = useParams();

  useTitle(titles.expectationAttach);

  const dispatch = useDispatch<Dispatch>();

  const navigate = useNavigateRelative();

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
            navigate(`/fg/${fgId}`, 'p/:id/*');
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
            navigate(`/fg/${fgId}`, 'p/:id/*');
          }
        }
      }
    },
    [dispatch, featureStoreData, projectId, navigate, fgId],
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { TinyPopup, usePopup } from '@logicalclocks/quartz';

// Components
import Loader from '../../components/loader/Loader';
import ExpectationForm from './forms/ExpectationForm';
// Types
import { ExpectationData } from './types';
import { Dispatch, RootState } from '../../store';
// Hooks
import useTitle from '../../hooks/useTitle';
import useNavigateRelative from '../../hooks/useNavigateRelative';
// Selectors
import {
  selectExpectationView,
  selectExpectationEditLoading,
  selectExpectationViewLoading,
} from '../../store/models/expectations/expectations.selectors';
// Utils
import { mapRules } from './utilts';

import titles from '../../sources/titles';

const EditExpectation: FC = () => {
  const { from, id: projectId, expName } = useParams();

  const [isPopupOpen, handleToggle] = usePopup();

  const dispatch = useDispatch<Dispatch>();

  const navigate = useNavigateRelative();

  const featureStoreData = useSelector((state: RootState) =>
    state.featureStores?.length ? state.featureStores[0] : null,
  );

  useEffect(() => {
    if (featureStoreData?.featurestoreId && expName) {
      dispatch.featureGroups.fetch({
        projectId: +projectId,
        featureStoreId: featureStoreData.featurestoreId,
        needMore: false,
      });
      dispatch.expectationView.fetch({
        projectId: +projectId,
        featureStoreId: featureStoreData.featurestoreId,
        name: expName,
      });
      dispatch.rules.fetch();
      if (from) {
        dispatch.featureGroupView.fetchByName({
          projectId: +projectId,
          featureStoreId: featureStoreData.featurestoreId,
          featureGroupName: from,
        });
      }
    }
  }, [dispatch, expName, projectId, featureStoreData, from]);

  const expectation = useSelector(selectExpectationView);

  const handleSubmit = useCallback(
    async (data: ExpectationData) => {
      if (featureStoreData?.featurestoreId && expectation) {
        const { rules, featureGroups, ...restData } = data;
        await dispatch.expectations.edit({
          projectId: +projectId,
          attachedFgs: featureGroups,
          prevName: expectation?.name,
          data: { ...restData, rules: mapRules(rules) },
          featureStoreId: featureStoreData.featurestoreId,
          prevAttachedFgs: expectation?.attachedFeatureGroups || [],
        });

        dispatch.featureGroupView.clear();
        navigate(`/fg`, 'p/:id/*');
      }
    },
    [dispatch, featureStoreData, projectId, navigate, expectation],
  );

  const handleDelete = useCallback(async () => {
    if (featureStoreData?.featurestoreId) {
      dispatch.expectations.delete({
        projectId: +projectId,
        featureStoreId: featureStoreData.featurestoreId,
        name: expName,
      });
      handleToggle();

      navigate('/fg', 'p/:id/*');
    }
  }, [dispatch, featureStoreData, projectId, navigate, handleToggle, expName]);

  const isExpectationLoading = useSelector(selectExpectationViewLoading);

  const isSubmit = useSelector(selectExpectationEditLoading);

  useTitle(titles.expectationEdit);

  if (isExpectationLoading || !expectation) {
    return <Loader />;
  }

  return (
    <>
      <ExpectationForm
        isEdit={true}
        onSubmit={handleSubmit}
        onDelete={handleToggle}
        initialData={expectation}
        isLoading={isSubmit}
        isDisabled={isSubmit}
      />
      <TinyPopup
        width="440px"
        isOpen={isPopupOpen}
        onClose={handleToggle}
        title={`Delete ${expectation.name}`}
        secondaryButton={['Back', handleToggle]}
        mainButton={['Delete expectation', handleDelete]}
        secondaryText="Once you delete an expectation, there is no going back. Please be certain."
      />
    </>
  );
};

export default EditExpectation;

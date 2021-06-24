import { createModel } from '@rematch/core';
import { Expectation } from '../../../types/expectation';
import ExpectationService from '../../../services/project/ExpectationService';
import { FeatureGroup } from '../../../types/feature-group';
import { ExpectationData } from '../../../pages/expectation/types';

export type ExpectationsState = Expectation[];

const expectations = createModel()({
  state: [] as ExpectationsState,
  reducers: {
    setState: (
      _: ExpectationsState,
      payload: ExpectationsState,
    ): ExpectationsState => payload,
    clear: () => [],
  },
  effects: (dispatch) => ({
    fetch: async ({
      projectId,
      featureStoreId,
      featureGroupId,
    }: {
      projectId: number;
      featureStoreId: number;
      featureGroupId?: number;
    }): Promise<any> => {
      if (featureGroupId) {
        const data = await ExpectationService.getList(
          projectId,
          featureStoreId,
          featureGroupId,
        );

        dispatch.expectations.setState(data);
      } else {
        const data = await ExpectationService.getAllList(
          projectId,
          featureStoreId,
        );

        dispatch.expectations.setState(data);
      }
    },
    create: async ({
      projectId,
      featureStoreId,
      data,
    }: {
      projectId: number;
      featureStoreId: number;
      data: any;
    }): Promise<ExpectationData> => {
      const { data: expectation } = await ExpectationService.create(
        projectId,
        featureStoreId,
        data,
      );

      return expectation;
    },
    edit: async ({
      data,
      prevName,
      projectId,
      attachedFgs,
      featureStoreId,
      prevAttachedFgs,
    }: {
      data: any;
      prevName: string;
      projectId: number;
      featureStoreId: number;
      attachedFgs: FeatureGroup[];
      prevAttachedFgs: FeatureGroup[];
    }): Promise<any> => {
      await Promise.allSettled(
        prevAttachedFgs.map(({ id }) =>
          ExpectationService.detach(projectId, featureStoreId, id, prevName),
        ),
      );

      await ExpectationService.edit(projectId, featureStoreId, data);

      await Promise.allSettled(
        attachedFgs.map(({ id }) =>
          ExpectationService.attach(projectId, featureStoreId, id, data.name),
        ),
      );
    },
    attach: async ({
      projectId,
      featureStoreId,
      featureGroupId,
      name,
    }: {
      projectId: number;
      featureStoreId: number;
      featureGroupId: number;
      name: string;
    }): Promise<any> => {
      await ExpectationService.attach(
        projectId,
        featureStoreId,
        featureGroupId,
        name,
      );
    },
    detach: async ({
      projectId,
      featureStoreId,
      featureGroupId,
      name,
    }: {
      projectId: number;
      featureStoreId: number;
      featureGroupId: number;
      name: string;
    }): Promise<any> => {
      await ExpectationService.detach(
        projectId,
        featureStoreId,
        featureGroupId,
        name,
      );

      dispatch.featureGroupView.deleteExpectation(name);
    },
    delete: async ({
      projectId,
      featureStoreId,
      name,
    }: {
      projectId: number;
      featureStoreId: number;
      name: string;
    }): Promise<any> => {
      await ExpectationService.delete(projectId, featureStoreId, name);
    },
  }),
});

export default expectations;

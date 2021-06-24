import { createModel } from '@rematch/core';
import { Expectation } from '../../../types/expectation';
import ExpectationService from '../../../services/project/ExpectationService';

export type expectationViewState = Expectation | null;

const expectationView = createModel()({
  state: null as expectationViewState,
  reducers: {
    setData: (
      _: expectationViewState,
      payload: Expectation,
    ): expectationViewState => payload,
    clear: () => null,
  },
  effects: (dispatch) => ({
    fetch: async ({
      projectId,
      featureStoreId,
      name,
    }: {
      projectId: number;
      featureStoreId: number;
      name: string;
    }): Promise<void> => {
      const data = await ExpectationService.getOne(
        projectId,
        featureStoreId,
        name,
      );
      const { data: attachedFGs } =
        await ExpectationService.getAttachedFeatureGroups(
          projectId,
          featureStoreId,
          name,
        );
      dispatch.expectationView.setData({
        ...data,
        attachedFeatureGroups: attachedFGs || [],
      });
    },
  }),
});

export default expectationView;

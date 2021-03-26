import { createModel } from '@rematch/core';
import { Validation } from '../../../types/expectation';
import ExpectationService from '../../../services/project/ExpectationService';

export type ValidatorsState = Validation[];

const validators = createModel()({
  state: [] as ValidatorsState,
  reducers: {
    setState: (_: ValidatorsState, payload: ValidatorsState): ValidatorsState =>
      payload,
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
      featureGroupId: number;
    }): Promise<any> => {
      const data = await ExpectationService.getValidations(
        projectId,
        featureStoreId,
        featureGroupId,
      );

      dispatch.validators.setState(data);
    },
  }),
});

export default validators;

import { createModel } from '@rematch/core';
import { Rule } from '../../../types/expectation';
import ExpectationService from '../../../services/project/ExpectationService';

export type RulesState = Rule[];

const rules = createModel()({
  state: [] as RulesState,
  reducers: {
    setState: (_: RulesState, payload: RulesState): RulesState => payload,
    clear: () => [],
  },
  effects: (dispatch) => ({
    fetch: async (): Promise<any> => {
      const { data } = await ExpectationService.getRules();

      dispatch.rules.setState(data?.items || []);
    },
  }),
});

export default rules;

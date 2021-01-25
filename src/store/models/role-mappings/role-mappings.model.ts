import { createModel } from '@rematch/core';
import RoleMappingResourceService from '../../../services/project/RoleMappingsService';
import { RoleMapping } from '../../../types/role-mapping';

export type RoleMappingState = RoleMapping[];

const roleMappings = createModel()({
  state: [] as RoleMappingState,
  reducers: {
    setData: (
      _: RoleMappingState,
      payload: RoleMappingState,
    ): RoleMappingState => payload,
    clear: (): RoleMappingState => [],
  },
  effects: (dispatch) => ({
    fetch: async ({ projectId }: { projectId: number }): Promise<void> => {
      const { data } = await RoleMappingResourceService.getList(projectId);
      dispatch.roleMappings.setData(data.items || []);
    },
  }),
});

export default roleMappings;

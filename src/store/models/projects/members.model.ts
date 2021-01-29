import { createModel } from '@rematch/core';
import { User } from '../../../types/user';
import BaseApiService from '../../../services/BaseApiService';
import ProjectsService from '../../../services/project/ProjectsService';

export type MembersState = User[];

const members = createModel()({
  state: [] as MembersState,
  reducers: {
    setData: (_: MembersState, payload: MembersState): MembersState => payload,
  },
  effects: (dispatch) => ({
    fetch: async (): Promise<void> => {
      const { data } = await new BaseApiService().request<{ items: [] }>({
        url: 'users?filter_by=role_neq:agent',
      });

      const { items = [] } = data;

      dispatch.members.setData(items);
    },
    add: async ({ data, id }: { data: any; id: number }): Promise<any> => {
      return await ProjectsService.addMembers(id, data);
    },
    edit: async ({
      email,
      role,
      id,
    }: {
      id: number;
      email: string;
      role: string;
    }): Promise<any> => {
      return await ProjectsService.editMemberRole(id, email, role);
    },
    delete: async ({
      id,
      email,
    }: {
      id: number;
      email: string;
    }): Promise<any> => {
      return await ProjectsService.deleteMember(id, email);
    },
  }),
});

export default members;

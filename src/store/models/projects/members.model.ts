import { createModel } from '@rematch/core';
import { User } from '../../../types/user';
import BaseApiService from '../../../services/BaseApiService';
import ProjectsService from '../../../services/project/ProjectsService';
import {AxiosError} from 'axios';

export type MembersState = {data: User[], error: AxiosError, };
export type MembersAddState = {success: any, error: AxiosError};

export function loadSuccess(_: MembersState, results: User[]){
  const memberState = {} as MembersState;
  memberState.data = results;
  return memberState;
}

export function loadError(_: MembersState, error: AxiosError){
  const memberState = {} as MembersState;
  memberState.data = [];
  memberState.error = error;
  return memberState;
}

const members = createModel()({
  state: {} as MembersState,
  reducers: {
    setData: loadSuccess,
    setError: loadError,
  },
  effects: (dispatch) => ({
    fetch: async (): Promise<void> => {
      try {
        const { data } = await new BaseApiService().request<{ items: [] }>({
          url: 'users?filter_by=role_neq:agent',
        });
        const { items = [] } = data;

        dispatch.members.setData(items);
      } catch (error) {
        dispatch.members.setError(error);
      }
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

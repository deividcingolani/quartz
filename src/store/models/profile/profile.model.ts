import { createModel } from '@rematch/core';

// Services
import ProfileService from '../../../services/ProfileService';
// Types
import { User } from '../../../types/user';

export type ProfileState = User;

const profile = createModel()({
  state: {} as User,
  reducers: {
    setUser: (payload: User): ProfileState => payload,
  },
  effects: (dispatch) => ({
    getUser: async (): Promise<void> => {
      const { data: user } = await ProfileService.get();

      dispatch.profile.setUser(user);
    },
  }),
});

export default profile;

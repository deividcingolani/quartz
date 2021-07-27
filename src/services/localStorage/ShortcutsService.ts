import { LS_SHORTCUTS_KEY } from './constants';
import LocalStorageService, { LSObject } from './LocalStorageService';

export enum LSInnerKeys {
  'recent' = 'recent',
  'pinned' = 'pinned',
}

export interface ShortcutObject {
  recent: ShortcutItem[];
  pinned: ShortcutItem[];
}
export interface ShortcutItem {
  id: number;
  name: string;
  type: string;
}

type ShortcutsSetter =
  | {
      key: LSInnerKeys.recent;
      items: ShortcutObject['recent'];
    }
  | {
      key: LSInnerKeys.pinned;
      items: ShortcutObject['pinned'];
    };

class ShortcutsService extends LocalStorageService<ShortcutObject> {
  public getRecent(
    userId: number,
    projectId: number,
  ): ShortcutObject['recent'] {
    return this.get(userId, projectId)?.recent || [];
  }

  public getPinned(
    userId: number,
    projectId: number,
  ): ShortcutObject['pinned'] {
    return this.get(userId, projectId)?.pinned || [];
  }

  public set(
    userId: number,
    projectId: number,
    { key, items }: ShortcutsSetter,
  ): void {
    const all = this.getAll();
    const userProjects = all?.[userId];
    const currentProject = userProjects?.[projectId];
    const updated = {
      ...all,
      [userId]: {
        ...userProjects,
        [projectId]: {
          ...currentProject,
          [key]: items,
        },
      },
    };
    localStorage.setItem(this.localStorageKey, JSON.stringify(updated));
  }

  public delete(projectId: number, itemId: number): void {
    const all = this.getAll();

    const updated = Object.keys(all).reduce((acc, userId: string) => {
      const userData = all[+userId];
      acc[userId] = Object.keys(userData).reduce((acc0, pId: string) => {
        const project = userData[+pId];
        // eslint-disable-next-line no-param-reassign
        acc0[pId] =
          +pId === projectId
            ? {
                recent:
                  project.recent?.filter(
                    (x: ShortcutItem) => x.id !== itemId,
                  ) || [],
                pinned:
                  project.pinned?.filter(
                    (x: ShortcutItem) => x.id !== itemId,
                  ) || [],
              }
            : acc0[pId];
        return acc0;
      }, {} as any);
      return acc;
    }, {} as any) as LSObject<ShortcutObject>;

    localStorage.setItem(this.localStorageKey, JSON.stringify(updated));
  }
}

export default new ShortcutsService(LS_SHORTCUTS_KEY);

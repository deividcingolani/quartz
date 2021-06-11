export enum LSInnerKeys {
  'recent' = 'recent',
  'pinned' = 'pinned',
}

export interface LSProjectObject {
  recent: LSDataEntity[];
  pinned: LSDataEntity[];
}

export interface LSUserContent {
  [key: number]: LSProjectObject;
}
export interface LSObject {
  [key: number]: LSUserContent;
}

export interface LSDataEntity {
  id: number;
  name: string;
  type: string;
}

type LSSetterType =
  | {
      key: LSInnerKeys.recent;
      items: LSProjectObject['recent'];
    }
  | {
      key: LSInnerKeys.pinned;
      items: LSProjectObject['pinned'];
    };

const LOCAL_STORAGE_KEY = 'shortcuts';

class ShortcutsService {
  private static getAll(): LSObject {
    const shortcutsStr = localStorage.getItem(LOCAL_STORAGE_KEY);
    const shortcuts = shortcutsStr ? JSON.parse(shortcutsStr) : null;
    return shortcuts;
  }

  private static getByUser(userId: number) {
    return ShortcutsService.getAll()?.[userId];
  }

  private static getByUserProject(userId: number, projectId: number) {
    return ShortcutsService.getByUser(userId)?.[projectId];
  }

  public static get(userId: number, projectId: number): LSProjectObject {
    return ShortcutsService.getByUserProject(userId, projectId);
  }

  public static clear(): void {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }

  public static getRecent(
    userId: number,
    projectId: number,
  ): LSProjectObject['recent'] {
    return ShortcutsService.get(userId, projectId)?.recent || [];
  }

  public static getPinned(
    userId: number,
    projectId: number,
  ): LSProjectObject['pinned'] {
    return ShortcutsService.get(userId, projectId)?.pinned || [];
  }

  public static set(
    userId: number,
    projectId: number,
    { key, items }: LSSetterType,
  ): void {
    const all = ShortcutsService.getAll();
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
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  }

  public static delete(projectId: number, itemId: number): void {
    const all = ShortcutsService.getAll();

    const updated = Object.keys(all).reduce((acc, userId: string) => {
      const userData = all[+userId];
      acc[userId] = Object.keys(userData).reduce((acc0, pId: string) => {
        const project = userData[+pId];
        acc0[pId] = +pId === projectId ? {
          recent:
            project.recent?.filter((x: LSDataEntity) => x.id !== itemId) || [],
          pinned:
            project.pinned?.filter((x: LSDataEntity) => x.id !== itemId) || [],
        } : acc0[pId];
        return acc0;
      }, {} as any);
      return acc;
    }, {} as any) as LSObject;

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  }
}

export default ShortcutsService;

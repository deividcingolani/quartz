// User specific
export interface LSUserContent<T> {
  [key: number]: T;
}

// User-Project specific
export interface LSObject<T> {
  [key: number]: LSUserContent<T>;
}

class LocalStorageService<T> {
  localStorageKey: string;

  constructor(localStorageKey: string) {
    this.localStorageKey = localStorageKey;
  }

  protected getAll(): LSObject<T> {
    const strItem = localStorage.getItem(this.localStorageKey);
    const item = strItem ? JSON.parse(strItem) : null;
    return item;
  }

  private getByUser(userId: number): LSUserContent<T> {
    return this.getAll()?.[userId];
  }

  private getByUserProject(userId: number, projectId: number): T {
    return this.getByUser(userId)?.[projectId];
  }

  protected get(userId: number, projectId: number): T {
    return this.getByUserProject(userId, projectId);
  }

  public clear({
    userId,
    projectId,
  }: {
    userId: number;
    projectId: number;
  }): void {
    const all = this.getAll();
    const userProjects = all?.[userId];
    if (userProjects?.[projectId]) {
      delete userProjects[projectId];
    }
    const updated = {
      ...all,
      [userId]: {
        ...userProjects,
      },
    };
    localStorage.setItem(this.localStorageKey, JSON.stringify(updated));
  }
}

export default LocalStorageService;

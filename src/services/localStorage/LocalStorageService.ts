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

  protected clear(): void {
    localStorage.removeItem(this.localStorageKey);
  }
}

export default LocalStorageService;

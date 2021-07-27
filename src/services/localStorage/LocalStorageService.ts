export interface LSUserContent<T> {
  [key: number]: T;
}
export interface LSObject<T> {
  [key: number]: LSUserContent<T>;
}

export interface LSDataEntity {
  id: number;
  name: string;
  type: string;
}

class LocalStorageService<T> {
  localStorageKey: string;

  constructor(localStorageKey: string) {
    this.localStorageKey = localStorageKey;
  }

  protected getAll(): LSObject<T> {
    const shortcutsStr = localStorage.getItem(this.localStorageKey);
    const shortcuts = shortcutsStr ? JSON.parse(shortcutsStr) : null;
    return shortcuts;
  }

  private getByUser(userId: number) {
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

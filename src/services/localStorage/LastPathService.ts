import LocalStorageService from './LocalStorageService';

export type LastPathState = string;

class LastPathService extends LocalStorageService<LastPathState> {
  public getInfo(userId: number): LastPathState {
    return this.getAll()?.[userId] as LastPathState;
  }

  public setInfo({
    userId,
    data,
  }: {
    userId: number;
    data: LastPathState;
  }): void {
    const all = this.getAll();
    const updated = {
      ...all,
      [userId]: data,
    };
    localStorage.setItem(this.localStorageKey, JSON.stringify(updated));
  }

  public delete(userId: number): void {
    const all = this.getAll();
    if (all?.[userId]) {
      delete all[userId];
    }
    const updated = {
      ...all,
    };
    localStorage.setItem(this.localStorageKey, JSON.stringify(updated));
  }
}

export default new LastPathService('last_path');

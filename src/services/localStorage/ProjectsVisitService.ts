import { LS_PROJECTS_HISTORY_KEY } from './constants';
import LocalStorageService, { LSUserContent } from './LocalStorageService';

export interface ProjectVisit {
  project: string;
  time: string;
}

export type ProjectsVisitState = ProjectVisit[];

class ProjectsVisitService extends LocalStorageService<ProjectsVisitState> {
  public getHistory(userId: number): ProjectsVisitState {
    return (this.getAll()?.[userId] as unknown as ProjectsVisitState) || [];
  }

  public setVisit({
    userId,
    projectId,
    time,
  }: {
    userId: number;
    projectId: number;
    time: string;
  }): void {
    const all = this.getAll();
    const current = (all?.[userId] || []) as unknown as ProjectsVisitState;
    const filtered = current.filter((x) => +x.project !== +projectId);
    const updated = [{ project: projectId, time }, ...filtered];
    const allNew = { ...all, [userId]: updated };

    localStorage.setItem(this.localStorageKey, JSON.stringify(allNew));
  }

  public delete(projectId: number): void {
    const all = this.getAll() as unknown as LSUserContent<ProjectsVisitState>;

    const updated = Object.keys(all).reduce((acc, key) => {
      acc[+key] = all[+key].filter(
        (p) => +p.project !== +projectId,
      ) as unknown as ProjectVisit;
      return acc;
    }, {} as ProjectsVisitState);

    localStorage.setItem(this.localStorageKey, JSON.stringify(updated));
  }
}

export default new ProjectsVisitService(LS_PROJECTS_HISTORY_KEY);

import { Feature } from '../../types/feature';
import { FeatureGroup } from '../../types/feature-group';
import { LS_BASKET_KEY } from './constants';
import LocalStorageService from './LocalStorageService';

export interface BasketState {
  featureGroups: FeatureGroupBasket[];
  isSwitched: boolean;
  showTutorial: boolean;
}

export interface FeatureGroupBasket {
  fg: FeatureGroup;
  projectId: number;
  features: Feature[];
}

class BasketService extends LocalStorageService<BasketState> {
  public getBasket(userId: number, projectId: number): BasketState {
    return this.get(userId, projectId);
  }

  public getFgs(
    userId: number,
    projectId: number,
  ): BasketState['featureGroups'] {
    return this.get(userId, projectId)?.featureGroups || [];
  }

  public getisSwitched(
    userId: number,
    projectId: number,
  ): BasketState['isSwitched'] {
    return this.get(userId, projectId)?.isSwitched || false;
  }

  public setAll(userId: number, projectId: number, basket: BasketState): void {
    const all = this.getAll();
    const userProjects = all?.[userId];
    const updated = {
      ...all,
      [userId]: {
        ...userProjects,
        [projectId]: {
          ...basket,
        },
      },
    };
    localStorage.setItem(this.localStorageKey, JSON.stringify(updated));
  }
}

export default new BasketService(LS_BASKET_KEY);

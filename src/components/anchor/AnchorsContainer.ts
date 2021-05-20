export type Subscriber = (activeAnchor: string | null) => void;

export interface Subscribers {
  [key: string]: Subscriber[];
}

class AnchorsContainer {
  private readonly groups = new Map<string, string | null>();

  private readonly subscribers: Subscribers = {};

  readonly addGroup = (name: string): void => {
    this.groups.set(name, null);
    this.subscribers[name] = [];
  };

  readonly isGroupExists = (name: string): boolean => {
    return Array.from(this.groups.keys()).includes(name);
  };

  readonly removeGroup = (name: string): void => {
    this.groups.delete(name);
  };

  readonly setActive = (group: string, anchor: string): void => {
    this.groups.set(group, anchor);

    this.notify(group);
  };

  readonly deactivate = (group: string): void => {
    this.groups.set(group, null);

    this.notify(group);
  };

  readonly active = (group: string): string | null => {
    return this.groups.get(group) || null;
  };

  readonly isActive = (group: string, anchor: string): boolean => {
    return this.groups.get(group) === anchor;
  };

  readonly unsubscribe = (group: string, subscriber: Subscriber): void => {
    const subscribers = this.subscribers[group];

    if (subscribers && subscribers.includes(subscriber)) {
      this.subscribers[group] = subscribers.filter((sub) => sub !== subscriber);
    }
  };

  readonly subscribe = (group: string, callback: Subscriber): void => {
    this.subscribers[group].push(callback);
  };

  private readonly notify = (group: string): void => {
    this.subscribers[group].forEach((subscriber) => {
      subscriber(this.groups.get(group) || null);
    });
  };
}

export default new AnchorsContainer();

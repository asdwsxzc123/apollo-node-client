import { Config } from './config';
import { ConfigInterface } from './configInterface';
import { ConfigChange } from './config_change';
import { ConfigChangeEvent } from './config_change_event';
import { CHANGE_EVENT_NAME, PropertyChangeType } from './constants';

export type KVConfigContentType = {
  [key: string]: string;
};

export class PropertiesConfig extends Config implements ConfigInterface {
  private configs: Map<string, string> = new Map();

  public getProperty(key: string, defaultValue?: string): undefined | string {
    const value = this.configs.get(key);
    if (value !== undefined) {
      return value;
    }
    return defaultValue;
  }

  public getAllConfig(): Map<string, string> {
    return this.configs;
  }

  private setProperty(key: string, value: string): void {
    this.configs.set(key, value);
  }

  private deleteProperty(key: string): boolean {
    return this.configs.delete(key);
  }

  public addChangeListener(
    fn: (changeEvent: ConfigChangeEvent<string>) => void
  ): PropertiesConfig {
    this.addListener(CHANGE_EVENT_NAME, fn);
    return this;
  }

  public async _loadAndUpdateConfig(app: any): Promise<void> {
    if (app) {
      // diff change
      const config = this.list2Obj(app.items);
      const { added, deleted, changed } = this.diffMap(this.configs, config);
      // update change and emit changeEvent
      const configChangeEvent = this.updateConfigAndCreateChangeEvent(
        added,
        deleted,
        changed,
        config
      );
      if (configChangeEvent) {
        this.emit(CHANGE_EVENT_NAME, configChangeEvent);
      }
      // update releaseKey
      this.setReleaseKey(app.releaseKey);
    }
  }
  private list2Obj(list) {
    return list.reduce((total, cur) => {
      return { ...total ,[cur.key]: cur.value};
    }, {});
  }
  private diffMap(
    oldConfigs: Map<string, string>,
    newConfigs: { [key: string]: string }
  ): {
    added: string[];
    deleted: string[];
    changed: string[];
  } {
    const added: string[] = [];
    const deleted: string[] = [];
    const changed: string[] = [];
    for (const key in newConfigs) {
      if (oldConfigs.has(key)) {
        if (oldConfigs.get(key) !== newConfigs[key]) {
          changed.push(key);
        }
      } else {
        added.push(key);
      }
    }
    for (const key of oldConfigs.keys()) {
      if (!Object.prototype.hasOwnProperty.call(newConfigs, key)) {
        deleted.push(key);
      }
    }
    return {
      added,
      deleted,
      changed,
    };
  }

  private updateConfigAndCreateChangeEvent(
    added: string[],
    deleted: string[],
    changed: string[],
    newConfigs: {
      [key: string]: string;
    }
  ): undefined | ConfigChangeEvent<string> {
    const configChanges: Map<string, ConfigChange<string>> = new Map();

    for (const addedKey of added) {
      const newConfigValue = newConfigs[addedKey];
      configChanges.set(
        addedKey,
        new ConfigChange<string>(
          this.getNamespaceName(),
          addedKey,
          undefined,
          newConfigValue,
          PropertyChangeType.ADDED
        )
      );
      this.setProperty(addedKey, newConfigValue);
    }

    for (const deletedKey of deleted) {
      configChanges.set(
        deletedKey,
        new ConfigChange<string>(
          this.getNamespaceName(),
          deletedKey,
          this.configs.get(deletedKey),
          undefined,
          PropertyChangeType.DELETED
        )
      );
      this.deleteProperty(deletedKey);
    }

    for (const changedKey of changed) {
      const newConfigsValue = newConfigs[changedKey];
      configChanges.set(
        changedKey,
        new ConfigChange<string>(
          this.getNamespaceName(),
          changedKey,
          this.configs.get(changedKey),
          newConfigs[changedKey],
          PropertyChangeType.MODIFIED
        )
      );
      this.setProperty(changedKey, newConfigsValue);
    }

    let configChangeEvent: undefined | ConfigChangeEvent<string>;

    if (configChanges.size > 0) {
      configChangeEvent = new ConfigChangeEvent(
        this.getNamespaceName(),
        configChanges
      );
    }

    return configChangeEvent;
  }
}

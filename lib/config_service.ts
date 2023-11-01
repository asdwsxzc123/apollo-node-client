import { ConfigManager } from './config_manager';
import { CLUSTER_NAME_DEFAULT, NAMESPACE_APPLICATION } from './constants';
import { JSONConfig } from './json_config';
import { PlainConfig } from './plain_config';
import { PropertiesConfig } from './properties_config';

export class ConfigService {
  private readonly configManager: ConfigManager;

  constructor(
    private readonly options: {
      configServerUrl: string;
      appId: string;
      env: string;
      clusterName?: string;
      token: string;
    }
  ) {
    this.options = options;
    this.options.clusterName = this.options.clusterName
      ? this.options.clusterName
      : CLUSTER_NAME_DEFAULT;
    this.configManager = new ConfigManager({
      ...this.options,
      clusterName: this.options.clusterName,
    });
  }

  /**
   * getAppConfig, default namespace name: `application`
   */
  public async getAppConfig(): Promise<PropertiesConfig> {
    const config = await this.getConfig(NAMESPACE_APPLICATION);
    return config as PropertiesConfig;
  }

  /**
   * get Config by namespaceName
   */
  public getConfig(
    namespaceName: string
  ): Promise<PropertiesConfig | JSONConfig | PlainConfig> {
    return this.configManager.getConfig(namespaceName);
  }
}

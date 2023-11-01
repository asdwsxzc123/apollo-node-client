import { EventEmitter } from 'stream';
import { NOTIFICATION_ID_PLACEHOLDER } from './constants';
import { ConfigOptions } from './types';

export abstract class Config extends EventEmitter {
  private releaseKey = '';

  private notificationId = NOTIFICATION_ID_PLACEHOLDER;

  constructor(
    private readonly options: ConfigOptions,
    private readonly ip?: string
  ) {
    super();
    this.options = options;
  }

  public getNamespaceName(): string {
    return this.options.namespaceName;
  }

  public getNotificationId(): number {
    return this.notificationId;
  }

  public setNotificationId(newNotificationId: number): void {
    this.notificationId = newNotificationId;
  }

  protected getConfigOptions(): ConfigOptions {
    return this.options;
  }

  protected getAppId(): string {
    return this.options.appId;
  }

  protected getToken(): undefined | string {
    return this.options.token;
  }

  protected getReleaseKey(): string {
    return this.releaseKey;
  }

  protected setReleaseKey(releaseKey: string): void {
    this.releaseKey = releaseKey;
  }

  protected getIp(): undefined | string {
    return this.ip;
  }

  public async loadAndUpdateConfig(app:any): Promise<void> {
    return this._loadAndUpdateConfig(app);
  }

  abstract _loadAndUpdateConfig(
    app: any
  ): Promise<void>;
}

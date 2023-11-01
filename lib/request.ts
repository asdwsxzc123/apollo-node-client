import fetch, { HeadersInit } from 'node-fetch';

export type ConfigUrlOptions = {
  env: string;
  configServerUrl: string;
  appId: string;
  clusterName: string;
  namespaceName?: string;
  releaseKey?: string;
  ip?: string;
};

export type NotificationsUrlOptions = {
  configServerUrl: string;
  appId: string;
  clusterName: string;
  env: string;
};

export type ConfigQueryParam = {
  releaseKey: string;
  ip: string;
};

export type Notification = {
  name: string;
  appId: string;
  dataChangeCreatedBy: string;
  dataChangeLastModifiedBy: string;
  dataChangeCreatedTime: string;
  dataChangeLastModifiedTime: string;
  orgId: string;
};

export type LoadConfigResp<T> = {
  appId: string;
  cluster: string;
  namespaceName: string;
  configurations: T;
  releaseKey: string;
};

export class Request {
  public static formatConfigUrl(urlOptions: ConfigUrlOptions): string {
    const {
      appId,
      clusterName,
      configServerUrl,
      releaseKey,
      env,
      ip,
    } = urlOptions;
    const url = configServerUrl.endsWith('/')
      ? configServerUrl.substring(0, configServerUrl.length - 1)
      : configServerUrl;
    const params: ConfigQueryParam = Object.create(null);
    if (releaseKey) {
      params.releaseKey = releaseKey;
    }
    if (ip) {
      params.ip = ip;
    }

    return `${url}/openapi/v1/envs/${env}/apps/${appId}/clusters/${clusterName}/namespaces`;
  }

  public static async fetchConfig<T>(
    url: string,
    headers?: HeadersInit
  ): Promise<LoadConfigResp<T>[] | null> {
    const response = await fetch(url, { headers });
    const status = response.status;
    const text = await response.text();
    if (status === 304) return null;
    if (status != 200)
      throw new Error(`Http request error: ${status}, ${response.statusText}`);
    if (!text) return null;
    return JSON.parse(text);
  }

  public static formatNamespaceUrl(
    options: NotificationsUrlOptions,
  ): string {
    const { configServerUrl, appId } = options;
    const url = configServerUrl.endsWith('/')
      ? configServerUrl.substring(0, configServerUrl.length - 1)
      : configServerUrl;
    return `${url}/openapi/v1/apps?appIds=${appId}`;
  }

  public static async fetchNotifications(
    url: string,
    headers?: HeadersInit
  ): Promise<Notification | null> {
    const response = await fetch(url, { headers, timeout: 70000 });
    const status = response.status;
    const text = await response.text();
    if (status === 304) return null;
    if (status != 200)
      throw new Error(`Http request error: ${status}, ${response.statusText}`);
    if (!text) return null;
    return JSON.parse(text);
  }
}


export type AuthHeader = {
  Authorization: string;
  Timestamp: string;
};

export class Access {

  public static DELIMITER = '\n';

  public static createAccessHeader( token: string): AuthHeader {
    return this.createAccessHeaderByTimestamp(
      new Date().getTime(),
      token
    );
  }

  private static createAccessHeaderByTimestamp(timestamp: number, token: string, ): AuthHeader {
    const accessHeader = {
      Authorization: '',
      Timestamp: timestamp.toString(),
    };
    accessHeader.Authorization = token;
    return accessHeader;
  }

}

/* eslint-disable @typescript-eslint/no-unused-vars */

export interface UnmineableApi {
  getCoin: (coins: string, address: string) => Promise<string>;
  getWorkers: (uuid: string) => Promise<string>;
  openBrowser: (coin: string, address: string) => Promise<void>;
}

export const unmineableApi = {
  getCoin: (_: string, __: string) => Promise.resolve(''),
  getWorkers: (_: string) => Promise.resolve(''),
  openBrowser: (_: string, __: string) => Promise.resolve(),
};

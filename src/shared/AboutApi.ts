/* eslint-disable @typescript-eslint/no-unused-vars */

export interface AboutApi {
  getName: () => Promise<string>;
  getVersion: () => Promise<string>;
  getElectronVersion: () => Promise<string>;
  openBrowser: (url: string) => Promise<void>;
}

export const aboutApi = {
  getName: () => Promise.resolve(''),
  getVersion: () => Promise.resolve(''),
  getElectronVersion: () => Promise.resolve(''),
  openBrowser: (_: string) => Promise.resolve(),
};

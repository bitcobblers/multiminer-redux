/* eslint-disable @typescript-eslint/no-unused-vars */

export interface DownloadApi {
  getMinerReleases: (owner: string, repo: string) => Promise<string>;
  downloadMiner: (name: string, version: string, url: string) => Promise<boolean>;
}

export const downloadApi = {
  getMinerReleases: (_: string, __: string) => Promise.resolve(''),
  downloadMiner: (_: string, __: string, ___: string) => Promise.resolve(false),
};

/* eslint-disable @typescript-eslint/no-unused-vars */
import { invoke } from '@tauri-apps/api';

export interface AboutApi {
  getName: () => Promise<string>;
  getVersion: () => Promise<string>;
}

export const aboutApi = {
  getName: () => invoke<string>('about_get_name'),
  getVersion: () => invoke<string>('about_get_version'),
};

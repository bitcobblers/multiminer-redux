/* eslint-disable @typescript-eslint/no-unused-vars */
import { invoke } from '@tauri-apps/api';

export const aboutApi = {
  getName: () => invoke<string>('about_get_name'),
  getVersion: () => invoke<string>('about_get_version'),
  openBrowser: (url: string) => invoke('about_open_browser', { url }),
};

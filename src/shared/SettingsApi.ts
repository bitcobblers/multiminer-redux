/* eslint-disable @typescript-eslint/no-unused-vars */

import { SettingsSchemaType } from '../models';

export interface SettingsApi {
  read: (key: keyof SettingsSchemaType) => Promise<string>;
  write: (key: keyof SettingsSchemaType, content: string) => Promise<void>;
  watch: (key: keyof SettingsSchemaType) => Promise<void>;
  changed: (callback: (key: keyof SettingsSchemaType, content: string) => void) => Promise<void>;
  importSettings: (settingsPath: string) => Promise<string>;
  exportSettings: (settingsPath: string) => Promise<string>;
}

export const settingsApi = {
  read: async (_: keyof SettingsSchemaType) => Promise.resolve(''),
  write: async (_: keyof SettingsSchemaType, __: string) => Promise.resolve(),
  watch: async (_: keyof SettingsSchemaType) => Promise.resolve(),
  changed: async (_: (key: keyof SettingsSchemaType, content: string) => void) => Promise.resolve(),
  importSettings: async (_: string) => Promise.resolve(''),
  exportSettings: async (_: string) => Promise.resolve(''),
};

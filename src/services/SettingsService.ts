/* eslint-disable @typescript-eslint/lines-between-class-members */
import { Subject } from 'rxjs';
import { Store } from 'tauri-plugin-store-api';
import {
  Coin,
  Wallet,
  Miner,
  AppSettings,
  DefaultSettings,
  SettingsSchemaType,
  MinerRelease,
} from '../models';

class WatchersObservable {
  wallets = new Subject<Wallet[]>();
  coins = new Subject<Coin[]>();
  miners = new Subject<Miner[]>();
  settings = new Subject<AppSettings>();
  minerReleases = new Subject<MinerRelease[]>();
}

type SettingsTypes = Wallet[] & Coin[] & Miner[] & AppSettings & MinerRelease[];

const store = new Store('.settings.dat');

export const watchers$ = new WatchersObservable();

async function get<T>(key: keyof SettingsSchemaType, defaultValue: T) {
  const content = await store.get<T>(key);

  if (content === null) {
    return defaultValue;
  }

  return content;
}

async function set<T>(key: keyof SettingsSchemaType, setting: T) {
  await store.set(key, setting);
  await store.save();
}

export const getWallets = () => get<Wallet[]>('wallets', DefaultSettings.wallets);
export const setWallets = (wallets: Wallet[]) => set('wallets', wallets);

export const getCoins = () => get<Coin[]>('coins', DefaultSettings.coins);
export const setCoins = (coins: Coin[]) => set('coins', coins);

export const getMiners = () => get<Miner[]>('miners', DefaultSettings.miners);
export const setMiners = (miners: Miner[]) => set('miners', miners);

export const getAppSettings = () => get<AppSettings>('settings', DefaultSettings.settings);
export const setAppSettings = (settings: AppSettings) => set('settings', settings);

export const getMinerReleases = () =>
  get<MinerRelease[]>('minerReleases', DefaultSettings.minerReleases);
export const setMinerReleases = (releases: MinerRelease[]) => set('minerReleases', releases);

export const importSettings = async (path: string) => {
  console.log(`importing settings from: ${path}`);

  const importedStore = new Store(path);
  const entries = await importedStore.entries();

  await store.clear();

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of entries) {
    console.log(`importing key: ${key}`);

    // eslint-disable-next-line no-await-in-loop
    await store.set(key, value);
  }

  await store.save();
  return true;
};

export const exportSettings = async (path: string) => {
  console.log(`exporting settings to: ${path}`);

  const exportedStore = new Store(path);
  const entries = await store.entries();

  await exportedStore.clear();

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of entries) {
    console.log(`exporting key: ${key}`);

    // eslint-disable-next-line no-await-in-loop
    await exportedStore.set(key, value);
  }

  await exportedStore.save();
  return true;
};

function watchSetting(setting: keyof WatchersObservable) {
  store.onKeyChange<SettingsTypes>(setting, (value) => {
    if (value !== null) {
      watchers$[setting].next(value);
    }
  });
}

export const enableSettingsWatchers = () => {
  watchSetting('wallets');
  watchSetting('coins');
  watchSetting('miners');
  watchSetting('settings');
  watchSetting('minerReleases');
};

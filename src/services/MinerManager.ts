import { join } from '@tauri-apps/api/path';
import { debug } from 'tauri-plugin-log-api';
import * as miningService from './MinerService';
import * as config from './SettingsService';
import {
  ALL_COINS,
  ALL_REFERRALS,
  CoinDefinition,
  AVAILABLE_MINERS,
  Miner,
  Coin,
  MinerInfo,
  Wallet,
  MinerState,
  minerState$,
  addAppNotice,
  AVAILABLE_POOLS,
} from '../models';
import { getMiners, getAppSettings, watchers$ as settingsWatcher$ } from './SettingsService';
import { ensureMiner } from './DownloadManager';
import * as coinStrategy from './strategies';

type CoinSelection = {
  miner: Miner;
  minerInfo: MinerInfo;
  coin: Coin;
  coinInfo: CoinDefinition;
  wallet: Wallet;
};

class CoinStrategies {
  normal = coinStrategy.normal;

  skynet = coinStrategy.skynet;
}

const coinStrategies = new CoinStrategies();
let timeout: NodeJS.Timeout;

function getRandom<T>(array: Array<T>) {
  return array[Math.floor(Math.random() * array.length)];
}

function lookupPool(name: string) {
  return AVAILABLE_POOLS.find((pool) => pool.name === name)!;
}

function lookupCoin(symbol: string | null, coins: Coin[]) {
  const result = coins.find((c) => c.symbol === symbol);
  return result !== undefined ? result : null;
}

function updateState(newState: Partial<MinerState>) {
  const currentState = minerState$.getValue();
  const mergedState = { ...currentState, ...newState };

  minerState$.next(mergedState);
}

function getConnectionString(
  symbol: string,
  address: string,
  memo: string,
  name: string,
  referral: string,
) {
  const sanitize = (value: string) => value.trim().replace(/\s+/g, '');

  if (memo === '') {
    return `${symbol}:${sanitize(address)}.${sanitize(name)}#${referral}`;
  }

  return `${symbol}:${sanitize(address)}:${sanitize(memo)}.${sanitize(name)}#${referral}`;
}

function getUrl(url: string, port: number, isSsl: boolean) {
  const prefix = isSsl ? 'stratum+ssl://' : 'stratum+tcp://';
  return `${prefix}${url}:${port}`;
}

export async function selectCoin(
  symbol: string | null,
  onError: (message: string) => void,
  onSuccess: (selection: CoinSelection) => Promise<void>,
) {
  const { miner, currentCoin } = minerState$.getValue();
  const appSettings = await config.getAppSettings();
  const minerInfo = AVAILABLE_MINERS.find((m) => m.name === miner?.kind);
  const selectCoinStrategy = coinStrategies[appSettings.settings.coinStrategy ?? 'normal'];

  if (miner === undefined) {
    onError('No miners have been enabled.');
    return;
  }

  if (minerInfo === undefined) {
    onError('Could not find any information about this miner.');
    return;
  }

  const enabledCoins = (await config.getCoins()).filter((c) => c.enabled);

  if (enabledCoins.length === 0) {
    onError('No coins have been configured for mining.');
    return;
  }

  const coin = lookupCoin(symbol, enabledCoins) ?? selectCoinStrategy(currentCoin, enabledCoins);
  const coinInfo = ALL_COINS.find((c) => c.symbol === coin.symbol);

  if (coinInfo === undefined) {
    onError('Could not find any information about this coin.');
    return;
  }

  const wallet = (await config.getWallets()).find((w) => w.id === coin.wallet);

  if (wallet === undefined) {
    onError(`The wallet '${coin.wallet}' associated with ${coin.symbol} could not be found.`);
    return;
  }

  await onSuccess({ miner, minerInfo, coin, coinInfo, wallet });
}

async function changeCoin(symbol: string | null) {
  selectCoin(
    symbol,
    (error) => {
      addAppNotice('error', error);
    },
    async (selection) => {
      const appSettings = await config.getAppSettings();
      const { miner, minerInfo, coin, wallet } = selection;
      const pool = lookupPool(miner.pool);
      const isSsl = pool.sslPorts.includes(miner.port);

      const cs = getConnectionString(
        coin.symbol,
        wallet.address,
        wallet.memo,
        appSettings.settings.workerName,
        getRandom(ALL_REFERRALS),
      );

      const url = getUrl(pool.url, miner.port, isSsl);
      const filePath = await join(miner.version, minerInfo.exe);
      const minerArgs = minerInfo.getArgs(pool.algorithm.name, cs, url);
      const extraArgs = miner.parameters;
      const mergedArgs = `${minerArgs} ${extraArgs}`;

      debug(
        `Selected coin ${coin.symbol} to run for ${coin.duration} hours.  Path: ${filePath} -- Args: ${mergedArgs}`,
      );

      const minerAvailable = await ensureMiner(miner.kind, miner.version);

      if (minerAvailable) {
        await miningService.stopMiner();
        await miningService.startMiner(coin.symbol, minerInfo, miner.version, mergedArgs);
      }
    },
  );
}

export async function setProfile(profile: string) {
  const miner = (await getMiners()).find((m) => m.name === profile);
  updateState({ miner });
}

export async function nextCoin(symbol?: string) {
  clearTimeout(timeout);
  await changeCoin(symbol === undefined ? null : symbol);
}

export function stopMiner() {
  clearTimeout(timeout);
  miningService.stopMiner();
}

export async function startMiner() {
  clearTimeout(timeout);
  await changeCoin(null);
}

async function getDefaultMiner(defaultMiner: string) {
  const miners = await getMiners();
  return miners.find((m) => m.name === defaultMiner);
}

export async function initializeMinerManager() {
  const appSettings = await getAppSettings();
  const defaultMiner = await getDefaultMiner(appSettings.settings.defaultMiner);

  updateState({
    miner: defaultMiner,
  });

  miningService.minerExited$.subscribe(() => {
    updateState({
      state: 'inactive',
      currentCoin: null,
    });
  });

  miningService.minerStarted$.subscribe(({ coin }) => {
    updateState({
      state: 'active',
      currentCoin: coin,
    });

    config.getCoins().then((coins) => {
      const MILLISECONDS_PER_HOUR = 1000 * 60 * 60;
      const c = coins.find((x) => x.symbol === coin);

      if (c !== undefined) {
        timeout = setTimeout(() => changeCoin(null), Number(c.duration) * MILLISECONDS_PER_HOUR);
      }
    });
  });

  settingsWatcher$.settings.subscribe(async (updatedAppSettings) => {
    const miner = await getDefaultMiner(updatedAppSettings.settings.defaultMiner);
    updateState({ miner });
  });

  settingsWatcher$.miners.subscribe(async (updatedMiners) => {
    const miner = updatedMiners.find((m) => m.name === minerState$.getValue().miner?.name);
    updateState({ miner });
  });
}

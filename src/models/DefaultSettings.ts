import { PaletteMode } from '@mui/material';
import { Wallet } from './Wallet';
import { Coin } from './Coin';
import { Miner } from './Miner';
import { AppSettings } from './AppSettings';
import { MinerRelease } from './MinerRelease';

export type SettingsSchemaType = {
  settings: AppSettings;
  theme: PaletteMode;
  wallets: Wallet[];
  coins: Coin[];
  miners: Miner[];
  minerReleases: MinerRelease[];
};

export const DefaultSettings: SettingsSchemaType = {
  wallets: [],
  coins: [],
  miners: [],
  settings: {
    settings: {
      workerName: 'default',
      defaultMiner: 'nbminer',
      coinStrategy: 'normal',
    },
    pools: {
      etchash: 'etchash.unmineable.com:3333',
      kawpow: 'kp.unmineable.com:3333',
      autolykos2: 'autolykos.unmineable.com:3333',
      randomx: 'rx.unmineable.com:3333',
    },
  },
  theme: 'dark',
  minerReleases: [],
};

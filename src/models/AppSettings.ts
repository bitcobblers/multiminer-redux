import { CoinSelectionStrategy } from './Enums';

export type GeneralSettings = {
  workerName: string;
  defaultMiner: string;
  coinStrategy: CoinSelectionStrategy;
};

export type AppSettings = {
  settings: GeneralSettings;
  pools: {
    etchash: string;
    kawpow: string;
    autolykos2: string;
    randomx: string;
  };
};

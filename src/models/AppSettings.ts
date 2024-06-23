import { CoinSelectionStrategy } from './Enums';

export type GeneralSettings = {
  workerName: string;
  defaultMiner: string;
  coinStrategy: CoinSelectionStrategy;
};

export type AppSettings = {
  settings: GeneralSettings;
};

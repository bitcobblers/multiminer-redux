import { Miner } from './Miner';

export type MinerState = {
  state: 'active' | 'inactive';
  currentCoin: string | null;
  miner?: Miner;
};

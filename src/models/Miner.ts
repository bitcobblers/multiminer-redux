import { MinerName } from './Enums';

export type Miner = {
  id: string;
  name: string;
  kind: MinerName;
  version: string;
  pool?: string;
  port?: number;
  parameters: string;
};

import { AlgorithmName, AlgorithmKind } from './Enums';

export type AlgorithmInfo = {
  name: AlgorithmName;
  kind: AlgorithmKind;
  minRam?: number;
};

export const AVAILABLE_ALGORITHMS: AlgorithmInfo[] = [
  { name: 'scrypt', kind: 'ASIC' },
  { name: 'sha256', kind: 'ASIC' },

  { name: 'ethashb3', kind: 'GPU', minRam: 3 },
  { name: 'karlsenhash', kind: 'GPU', minRam: 3 },
  { name: 'pyrinhash', kind: 'GPU', minRam: 3 },
  { name: 'sha512', kind: 'GPU', minRam: 3 },
  { name: 'xelishash', kind: 'GPU', minRam: 3 },
  { name: 'zelhash', kind: 'GPU', minRam: 3 },
  { name: 'zhash', kind: 'GPU', minRam: 3 },

  { name: 'autolykos2', kind: 'GPU', minRam: 3 },
  { name: 'blake3', kind: 'GPU', minRam: 3 },
  { name: 'etchash', kind: 'GPU', minRam: 3 },
  { name: 'nexapow', kind: 'GPU', minRam: 3 },

  { name: 'beamhash', kind: 'GPU', minRam: 3 },
  { name: 'dynexsolve', kind: 'GPU', minRam: 3 },
  { name: 'ethash', kind: 'GPU', minRam: 3 },
  { name: 'firopow', kind: 'GPU', minRam: 3 },
  { name: 'fishash', kind: 'GPU', minRam: 3 },
  { name: 'kawpow', kind: 'GPU', minRam: 3 },
  { name: 'octopus', kind: 'GPU', minRam: 3 },

  { name: 'randomx', kind: 'CPU' },
  { name: 'ghostrider', kind: 'CPU' },
];

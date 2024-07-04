import { AlgorithmName, AlgorithmKind, HashrateUnit, HashrateEfficiencyUnit } from './Enums';

export type AlgorithmInfo = {
  name: AlgorithmName;
  kind: AlgorithmKind;
  scale: HashrateUnit;
  efficiencyScale?: HashrateEfficiencyUnit;
  minRam?: number;
};

export const AVAILABLE_ALGORITHMS: AlgorithmInfo[] = [
  { name: 'scrypt', kind: 'ASIC', scale: 'TH/s', efficiencyScale: 'GH/W' },
  { name: 'sha256', kind: 'ASIC', scale: 'TH/s', efficiencyScale: 'GH/W' },

  { name: 'ethashb3', kind: 'GPU', scale: 'MH/s', efficiencyScale: 'KH/W', minRam: 3 },
  { name: 'karlsenhash', kind: 'GPU', scale: 'MH/s', efficiencyScale: 'KH/W', minRam: 3 },
  { name: 'pyrinhash', kind: 'GPU', scale: 'MH/s', efficiencyScale: 'KH/W', minRam: 3 },
  { name: 'sha512', kind: 'GPU', scale: 'MH/s', efficiencyScale: 'KH/W', minRam: 3 },
  { name: 'xelishash', kind: 'GPU', scale: 'MH/s', efficiencyScale: 'KH/W', minRam: 3 },
  { name: 'zelhash', kind: 'GPU', scale: 'MH/s', efficiencyScale: 'KH/W', minRam: 3 },
  { name: 'zhash', kind: 'GPU', scale: 'MH/s', efficiencyScale: 'KH/W', minRam: 3 },

  { name: 'autolykos2', kind: 'GPU', scale: 'MH/s', efficiencyScale: 'KH/W', minRam: 3 },
  { name: 'blake3', kind: 'GPU', scale: 'MH/s', efficiencyScale: 'KH/W', minRam: 3 },
  { name: 'etchash', kind: 'GPU', scale: 'MH/s', efficiencyScale: 'KH/W', minRam: 3 },
  { name: 'nexapow', kind: 'GPU', scale: 'MH/s', efficiencyScale: 'KH/W', minRam: 3 },

  { name: 'beamhash', kind: 'GPU', scale: 'Sol/s', efficiencyScale: 'Sol/W', minRam: 3 },
  { name: 'dynexsolve', kind: 'GPU', scale: 'MH/s', efficiencyScale: 'KH/W', minRam: 3 },
  { name: 'ethash', kind: 'GPU', scale: 'MH/s', efficiencyScale: 'KH/W', minRam: 3 },
  { name: 'firopow', kind: 'GPU', scale: 'MH/s', efficiencyScale: 'KH/W', minRam: 3 },
  { name: 'fishash', kind: 'GPU', scale: 'MH/s', efficiencyScale: 'KH/W', minRam: 3 },
  { name: 'kawpow', kind: 'GPU', scale: 'MH/s', efficiencyScale: 'KH/W', minRam: 3 },
  { name: 'octopus', kind: 'GPU', scale: 'MH/s', efficiencyScale: 'KH/W', minRam: 3 },

  { name: 'randomx', kind: 'CPU', scale: 'KH/s' },
  { name: 'ghostrider', kind: 'CPU', scale: 'KH/s' },
];

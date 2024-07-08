export const API_PORT = 60090;

export type MinerName =
  | 'gminer'
  | 'lolminer'
  | 'nbminer'
  | 'onezero'
  | 'rigel'
  | 'srbminer'
  | 'trexminer'
  | 'xmrig';

export type AlgorithmKind = 'CPU' | 'GPU' | 'ASIC';
export type AlgorithmName =
  // ASIC
  | 'scrypt'
  | 'sha256'

  // GPU (3GB)
  | 'ethashb3'
  | 'karlsenhash'
  | 'pyrinhash'
  | 'sha512'
  | 'xelishash'
  | 'zelhash'
  | 'zhash'

  // GPU (4GB)
  | 'autolykos'
  | 'blake3'
  | 'etchash'
  | 'nexapow'

  // GPU (6GB)
  | 'beamhash'
  | 'dynexsolve'
  | 'ethash'
  | 'firopow'
  | 'fishash'
  | 'kawpow'
  | 'octopus'

  // CPU
  | 'randomx'
  | 'ghostrider';

export type HashrateUnit = 'H/s' | 'KH/s' | 'MH/s' | 'GH/s' | 'TH/s' | 'Sol/s';
export type HashrateEfficiencyUnit = 'H/W' | 'KH/W' | 'MH/W' | 'GH/W' | 'Sol/W';

export type MiningPoolPortType = 'tcp' | 'ssl';

export type CoinSelectionStrategy = 'normal' | 'skynet';

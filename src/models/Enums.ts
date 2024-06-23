export const API_PORT = 60090;

export type MinerName = 'phoenixminer' | 'lolminer' | 'nbminer' | 'trexminer' | 'xmrig';
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
  | 'autolykos2'
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

export type MiningPoolPortType = 'tcp' | 'ssl';

export type CoinSelectionStrategy = 'normal' | 'skynet';

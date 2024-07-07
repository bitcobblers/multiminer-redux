import { AVAILABLE_ALGORITHMS, AlgorithmInfo } from './AlgorithmInfo';
import { AlgorithmName } from './Enums';

function getAlgorithm(name: AlgorithmName) {
  return AVAILABLE_ALGORITHMS.find((a) => a.name === name)!;
}

export type MiningPool = {
  name: string;
  url: string;
  algorithm: AlgorithmInfo;
  tcpPorts: number[];
  sslPorts: number[];
};

export const AVAILABLE_POOLS: MiningPool[] = [
  // ASIC
  {
    name: 'Scrypt',
    url: 'scrypt.unmineable.com',
    algorithm: getAlgorithm('scrypt'),
    tcpPorts: [3333, 13333, 80],
    sslPorts: [4444, 443],
  },
  {
    name: 'SHA-256',
    url: 'sha256.unmineable.com',
    algorithm: getAlgorithm('sha256'),
    tcpPorts: [3333, 13333, 80],
    sslPorts: [4444, 443],
  },

  // GPU (3GB)
  {
    name: 'EthashB3',
    url: 'ethashb3.unmineable.com',
    algorithm: getAlgorithm('ethashb3'),
    tcpPorts: [3333, 13333, 80],
    sslPorts: [4444, 443],
  },
  {
    name: 'KarlsenHash',
    url: 'karlsenhash.unmineable.com',
    algorithm: getAlgorithm('karlsenhash'),
    tcpPorts: [3333, 13333, 80],
    sslPorts: [4444, 443],
  },
  {
    name: 'PyrinHash',
    url: 'pyrinhash.unmineable.com',
    algorithm: getAlgorithm('pyrinhash'),
    tcpPorts: [3333, 13333, 80],
    sslPorts: [4444, 443],
  },
  {
    name: 'Sha512256d ',
    url: 'sha512256d.unmineable.com',
    algorithm: getAlgorithm('sha512'),
    tcpPorts: [3333, 13333, 80],
    sslPorts: [4444, 443],
  },
  {
    name: 'XelisHash',
    url: 'xelishash.unmineable.com',
    algorithm: getAlgorithm('xelishash'),
    tcpPorts: [3333, 13333, 80],
    sslPorts: [4444, 443],
  },
  {
    name: 'ZelHash',
    url: 'zelhash.unmineable.com',
    algorithm: getAlgorithm('zelhash'),
    tcpPorts: [3333, 13333, 80],
    sslPorts: [4444, 443],
  },
  {
    name: 'ZHash',
    url: 'zhash.unmineable.com',
    algorithm: getAlgorithm('zhash'),
    tcpPorts: [3333, 13333, 80],
    sslPorts: [4444, 443],
  },

  // GPU (4GB)
  {
    name: 'Autolykos',
    url: 'autolykos.unmineable.com',
    algorithm: getAlgorithm('autolykos'),
    tcpPorts: [3333, 13333, 80],
    sslPorts: [4444, 443],
  },
  {
    name: 'Blake3',
    url: 'blake3.unmineable.com',
    algorithm: getAlgorithm('blake3'),
    tcpPorts: [3333, 13333, 80],
    sslPorts: [4444, 443],
  },
  {
    name: 'Etchash',
    url: 'etchash.unmineable.com',
    algorithm: getAlgorithm('etchash'),
    tcpPorts: [3333, 13333, 80],
    sslPorts: [4444, 443],
  },
  {
    name: 'Nexapow',
    url: 'nexapow.unmineable.com',
    algorithm: getAlgorithm('nexapow'),
    tcpPorts: [3333, 13333, 80],
    sslPorts: [4444, 443],
  },

  // GPU (6GB)
  {
    name: 'BeamHash',
    url: 'beamhash.unmineable.com',
    algorithm: getAlgorithm('beamhash'),
    tcpPorts: [3333, 13333, 80],
    sslPorts: [4444, 443],
  },
  {
    name: 'DynexSolve',
    url: 'dynexsolve.unmineable.com',
    algorithm: getAlgorithm('dynexsolve'),
    tcpPorts: [3333, 13333, 80],
    sslPorts: [4444, 443],
  },
  {
    name: 'Ethash',
    url: 'ethash.unmineable.com',
    algorithm: getAlgorithm('ethash'),
    tcpPorts: [3333, 13333, 80],
    sslPorts: [4444, 443],
  },
  {
    name: 'Firopow',
    url: 'firopow.unmineable.com',
    algorithm: getAlgorithm('firopow'),
    tcpPorts: [3333, 13333, 80],
    sslPorts: [4444, 443],
  },
  {
    name: 'FishHash',
    url: 'fishhash.unmineable.com',
    algorithm: getAlgorithm('fishash'),
    tcpPorts: [3333, 13333, 80],
    sslPorts: [4444, 443],
  },
  {
    name: 'Kawpow',
    url: 'kp.unmineable.com',
    algorithm: getAlgorithm('kawpow'),
    tcpPorts: [3333, 13333, 80],
    sslPorts: [4444, 443],
  },
  {
    name: 'Octopus',
    url: 'octopus.unmineable.com',
    algorithm: getAlgorithm('octopus'),
    tcpPorts: [3333, 13333, 80],
    sslPorts: [4444, 443],
  },

  // CPU
  {
    name: 'RandomX',
    url: 'rx.unmineable.com',
    algorithm: getAlgorithm('randomx'),
    tcpPorts: [3333, 13333, 80],
    sslPorts: [443],
  },
  {
    name: 'GhostRider',
    url: 'ghostrider.unmineable.com',
    algorithm: getAlgorithm('ghostrider'),
    tcpPorts: [3333, 13333, 80],
    sslPorts: [443],
  },
];

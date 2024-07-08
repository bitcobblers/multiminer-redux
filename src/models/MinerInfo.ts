import { MinerName, AlgorithmName, API_PORT, AlgorithmKind } from './Enums';

export type MinerInfo = {
  name: MinerName;
  friendlyName: string;
  owner: string;
  repo: string;
  assetPattern: RegExp;
  optionsUrl: string;
  algorithms: AlgorithmName[];
  kind: AlgorithmKind;
  exe: string;
  hidden: boolean; // sets DETACHED_PROCESS flag for child_process.spawn
  getArgs: (algorithm: AlgorithmName, cs: string, url: string) => string;
};

function makeMiner<T extends AlgorithmName>(
  name: MinerName,
  algorithms: T[],
  friendlyName: string,
  owner: string,
  repo: string,
  assetPattern: RegExp,
  optionsUrl: string,
  kind: AlgorithmKind,
  exe: string,
  hidden: boolean,
  getArgs: (algorithm: T, cs: string, url: string) => string,
): MinerInfo {
  return {
    name,
    friendlyName,
    owner,
    repo,
    assetPattern,
    optionsUrl,
    algorithms,
    kind,
    exe,
    hidden,
    getArgs: (alg, cs, url) => getArgs(alg as T, cs, url),
  };
}

export const AVAILABLE_MINERS = [
  makeMiner(
    'gminer',
    [
      'autolykos',
      'beamhash',
      'etchash',
      'ethash',
      'firopow',
      'kawpow',
      'karlsenhash',
      'octopus',
      'sha512',
    ],
    'GMiner',
    'develsoftware',
    'GMinerRelease',
    /^.+_windows64\.zip$/,
    'https://github.com/develsoftware/GMinerRelease?tab=readme-ov-file#miner-options',
    'GPU',
    'miner.exe',
    true,
    (alg, cs, url) => {
      const algMap: Record<typeof alg, string> = {
        autolykos: 'autolykos2',
        beamhash: 'beam',
        etchash: 'etchash',
        ethash: 'ethash',
        firopow: 'firopow',
        kawpow: 'kawpow',
        karlsenhash: 'karlsen',
        octopus: 'octopus',
        sha512: 'sha512',
      };

      return `--algo ${algMap[alg]} --server ${url} --user ${cs} --color 0 --watchdog 0 --api ${API_PORT}`;
    },
  ),

  makeMiner(
    'lolminer',
    ['autolykos', 'beamhash', 'blake3', 'etchash', 'ethash', 'karlsenhash'],
    'lolMiner',
    'lolliedieb',
    'lolMiner-releases',
    /^.+Win64\.zip$/,
    'https://github.com/Lolliedieb/lolMiner-releases?tab=readme-ov-file#options-supported-by-lolminer',
    'GPU',
    'lolminer.exe',
    true,
    (alg, cs, url) => {
      const algMap: Record<typeof alg, string> = {
        autolykos: 'AUTOLYKOS2',
        beamhash: 'BEAM-III',
        blake3: 'ALEPH',
        etchash: 'ETCHASH',
        ethash: 'ETHASH',
        karlsenhash: 'KARLSEN',
      };

      return `--algo ${algMap[alg]} --pool ${url} --user ${cs} --nocolor --apiport ${API_PORT}`;
    },
  ),

  makeMiner(
    'nbminer',
    ['autolykos', 'beamhash', 'etchash', 'ethash', 'kawpow', 'octopus'],
    'NBMiner',
    'NebuTech',
    'NBMiner',
    /^NBMiner.+_Win\.zip$/,
    'https://github.com/NebuTech/NBMiner?tab=readme-ov-file#cmd-options',
    'GPU',
    'nbminer.exe',
    true,
    (alg, cs, url) => {
      const algMap: Record<typeof alg, string> = {
        autolykos: 'autolykos2',
        beamhash: 'beamv3',
        etchash: 'etchash',
        ethash: 'ethash',
        kawpow: 'kawpow',
        octopus: 'octopus',
      };

      return `--algo ${algMap[alg]} --url ${url} --user ${cs} --no-color --cmd-output 1 --api 127.0.0.1:${API_PORT}`;
    },
  ),

  makeMiner(
    'onezero',
    ['dynexsolve', 'xelishash'],
    'OneZeroMiner',
    'OneZeroMiner',
    'onezerominer',
    /^onezerominer-win64.+\.zip$/,
    'https://github.com/OneZeroMiner/onezerominer?tab=readme-ov-file#options',
    'GPU',
    'onezerominer.exe',
    true,
    (alg, cs, url) => {
      const algMap: Record<typeof alg, string> = {
        dynexsolve: 'dynex',
        xelishash: 'xelis',
      };

      return `--algo ${algMap[alg]} --pool ${url} --wallet ${cs} --api-port ${API_PORT}`;
    },
  ),

  makeMiner(
    'rigel',
    [
      'autolykos',
      'etchash',
      'ethash',
      'karlsenhash',
      'kawpow',
      'nexapow',
      'octopus',
      'pyrinhash',
      'sha512',
      'xelishash',
    ],
    'Rigel',
    'rigelminer',
    'rigel',
    /^rigel-.+-win\.zip$/,
    'https://github.com/rigelminer/rigel?tab=readme-ov-file#usage',
    'GPU',
    'rigel.exe',
    false,
    (alg, cs, url) => {
      const algMap: Record<typeof alg, string> = {
        autolykos: 'autolykos2',
        etchash: 'etchash',
        ethash: 'ethash',
        karlsenhash: 'karlsenhash',
        kawpow: 'kawpow',
        nexapow: 'nexapow',
        octopus: 'octopus',
        pyrinhash: 'pyrinhash',
        sha512: 'sha512256d',
        xelishash: 'xelishash',
      };

      return `--algorithm ${algMap[alg]} --url ${url} --username ${cs} --api-bind 127.0.0.1:${API_PORT} --no-colour --no-watchdog`;
    },
  ),

  makeMiner(
    'trexminer',
    ['autolykos', 'blake3', 'etchash', 'ethash', 'firopow', 'kawpow', 'octopus'],
    'T-Rex Miner',
    'trexminer',
    't-rex',
    /^t-rex-.+win.zip$/,
    'https://github.com/trexminer/T-Rex/blob/master/README.md#usage',
    'GPU',
    't-rex.exe',
    false,
    (alg, cs, url) => {
      const algMap: Record<typeof alg, string> = {
        autolykos: 'autolykos2',
        blake3: 'blake3',
        etchash: 'etchash',
        ethash: 'ethash',
        firopow: 'firopow',
        kawpow: 'kawpow',
        octopus: 'octopus',
      };

      return `--algo ${algMap[alg]} --url ${url} --user ${cs} --pass x --api-bind-http 127.0.0.1:${API_PORT} --api-read-only --no-color`;
    },
  ),

  makeMiner(
    'xmrig',
    ['randomx', 'ghostrider'],
    'XMRig',
    'xmrig',
    'xmrig',
    /^xmrig.+win64\.zip$/,
    'https://xmrig.com/docs/miner/command-line-options',
    'CPU',
    'xmrig.exe',
    true,
    (alg, cs, url) => {
      const algMap: Record<typeof alg, string> = {
        randomx: 'rx',
        ghostrider: 'gr',
      };

      return `--url ${url} --algo ${algMap[alg]} --keepalive --user ${cs} --pass x --api-worker-id 127.0.0.1 --http-port ${API_PORT}`;
    },
  ),
];

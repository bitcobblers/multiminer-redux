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
  getArgs: (
    algorithm: AlgorithmName,
    cs: string,
    url: string,
    port: number,
    isSsl: boolean,
  ) => string;
};

export const AVAILABLE_MINERS: MinerInfo[] = [
  {
    name: 'gminer',
    friendlyName: 'GMiner',
    algorithms: ['etchash', 'ethash', 'firopow', 'karlsenhash', 'kawpow', 'octopus'],
    kind: 'GPU',
    owner: 'develsoftware',
    repo: 'GMinerRelease',
    assetPattern: /^.+_windows64\.zip$/,
    optionsUrl: 'https://github.com/develsoftware/GMinerRelease?tab=readme-ov-file#miner-options',
    exe: 'miner.exe',
    hidden: true,
    getArgs: (alg, cs, url, port, isSsl) => {
      const algMap: Record<string, string> = {
        etchash: 'etchash',
        ethash: 'ethash',
        firopow: 'firopow',
        karlsenhash: 'karlsenhash',
        kawpow: 'kawpow',
        octopus: 'octopus',
        sha512: 'sh512_256d',
        autolykos2: 'autolykos2',
        beamhash: 'beamhash',
      };

      const prefix = isSsl ? 'stratum+ssl://' : '';

      return `--algo ${algMap[alg]} --server ${prefix}${url}:${port} --user ${cs} --color 0 --watchdog 0 --api ${API_PORT}`;
    },
  },
  {
    name: 'lolminer',
    friendlyName: 'lolMiner',
    algorithms: ['etchash', 'autolykos2', 'beamhash'],
    kind: 'GPU',
    owner: 'lolliedieb',
    repo: 'lolMiner-releases',
    assetPattern: /^.+Win64\.zip$/,
    optionsUrl:
      'https://github.com/Lolliedieb/lolMiner-releases?tab=readme-ov-file#options-supported-by-lolminer',
    exe: 'lolminer.exe',
    hidden: true,
    getArgs: (alg, cs, url, port, isSsl) => {
      const algMap: Record<string, string> = {
        etchash: 'ETCHASH',
        autolykos2: 'AUTOLYCOS2',
        beamhash: 'BEAM-III',
      };

      const prefix = isSsl ? 'stratum+ssl://' : '';
      return `--algo ${algMap[alg]} --pool ${prefix}${url}:${port} --user ${cs} --nocolor --apiport ${API_PORT}`;
    },
  },
  {
    name: 'nbminer',
    friendlyName: 'NBMiner',
    algorithms: ['etchash', 'kawpow', 'autolykos2'],
    kind: 'GPU',
    owner: 'NebuTech',
    repo: 'NBMiner',
    assetPattern: /^NBMiner.+_Win\.zip$/,
    optionsUrl: 'https://github.com/NebuTech/NBMiner?tab=readme-ov-file#cmd-options',
    exe: 'nbminer.exe',
    hidden: true,
    getArgs: (alg, cs, url, port, isSsl) => {
      const prefix = isSsl ? 'stratum+ssl://' : '';
      return `-a ${alg} -o ${prefix}${url}:${port} -u ${cs} --no-color --cmd-output 1 --api 127.0.0.1:${API_PORT}`;
    },
  },
  {
    name: 'trexminer',
    friendlyName: 'T-Rex Miner',
    algorithms: ['etchash', 'kawpow', 'autolykos2'],
    kind: 'GPU',
    owner: 'trexminer',
    repo: 't-rex',
    assetPattern: /^t-rex-.+win.zip$/,
    optionsUrl: 'https://github.com/trexminer/T-Rex/blob/master/README.md#usage',
    exe: 't-rex.exe',
    hidden: false,
    getArgs: (alg, cs, url, port, isSsl) => {
      const prefix = isSsl ? 'stratum+ssl://' : '';

      return `-a ${alg} -o ${prefix}${url}:${port} -u ${cs} -p x --api-bind-http 127.0.0.1:${API_PORT} --api-read-only --no-color`;
    },
  },
  {
    name: 'xmrig',
    friendlyName: 'XMRig',
    algorithms: ['randomx', 'ghostrider'],
    kind: 'CPU',
    owner: 'xmrig',
    repo: 'xmrig',
    assetPattern: /^xmrig.+win64\.zip$/,
    optionsUrl: 'https://xmrig.com/docs/miner/command-line-options',
    exe: 'xmrig.exe',
    hidden: true,
    getArgs: (alg, cs, url, port, isSsl) => {
      const algMap: Record<string, string> = {
        randomx: 'rx',
        ghostrider: 'gr',
      };

      const prefix = isSsl ? 'stratum+ssl://' : '';

      return `-o ${prefix}${url}:${port} -a ${algMap[alg]} -k -u ${cs} -p x --api-worker-id 127.0.0.1 --http-port ${API_PORT}`;
    },
  },
];

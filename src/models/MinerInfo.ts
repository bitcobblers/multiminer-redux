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
    name: 'lolminer',
    friendlyName: 'lolMiner',
    algorithms: ['etchash', 'autolykos2'],
    kind: 'GPU',
    owner: 'lolliedieb',
    repo: 'lolMiner-releases',
    assetPattern: /^.+Win64\.zip$/,
    optionsUrl: 'https://lolminer.site/documentation/arguments/',
    exe: 'lolminer.exe',
    getArgs: (alg, cs, url, port, isSsl) => {
      const prefix = isSsl ? 'stratum+ssl://' : '';
      return `--algo ${alg.toLocaleUpperCase()} --pool ${prefix}${url}:${port} --user ${cs} --nocolor --apiport ${API_PORT}`;
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
    optionsUrl: 'https://nbminer.info/documentation/arguments/',
    exe: 'nbminer.exe',
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
    optionsUrl: 'https://trexminer.info/documentation/arguments/',
    exe: 't-rex.exe',
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

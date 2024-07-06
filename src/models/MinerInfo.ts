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
  algorithms: T[],
  name: MinerName,
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
    ['etchash', 'ethash'],
    'gminer',
    'GMiner',
    'develsoftware',
    'GMinerRelease',
    /^.+_windows64\.zip$/,
    'https://github.com/develsoftware/GMinerRelease?tab=readme-ov-file#miner-options',
    'GPU',
    'miner.exe',
    true,
    (alg, cs, url) =>
      `--algo ${alg} --server ${url} --user ${cs} --color 0 --watchdog 0 --api ${API_PORT}`,
  ),

  makeMiner(
    ['etchash', 'autolykos2', 'beamhash'],
    'lolminer',
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
        etchash: 'ETCHASH',
        autolykos2: 'AUTOLYKOS2',
        beamhash: 'BEAM-III',
      };

      return `--algo ${algMap[alg]} --pool ${url} --user ${cs} --nocolor --apiport ${API_PORT}`;
    },
  ),

  makeMiner(
    ['etchash', 'kawpow', 'autolykos2'],
    'nbminer',
    'NBMiner',
    'NebuTech',
    'NBMiner',
    /^NBMiner.+_Win\.zip$/,
    'https://github.com/NebuTech/NBMiner?tab=readme-ov-file#cmd-options',
    'GPU',
    'nbminer.exe',
    true,
    (alg, cs, url) =>
      `--algo ${alg} --url ${url} --user ${cs} --no-color --cmd-output 1 --api 127.0.0.1:${API_PORT}`,
  ),

  makeMiner(
    ['etchash', 'kawpow', 'autolykos2'],
    'trexminer',
    'T-Rex Miner',
    'trexminer',
    't-rex',
    /^t-rex-.+win.zip$/,
    'https://github.com/trexminer/T-Rex/blob/master/README.md#usage',
    'GPU',
    't-rex.exe',
    false,
    (alg, cs, url) =>
      `--algo ${alg} --url ${url} --user ${cs} --pass x --api-bind-http 127.0.0.1:${API_PORT} --api-read-only --no-color`,
  ),

  makeMiner(
    ['randomx', 'ghostrider'],
    'xmrig',
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

      return `-o ${url} -a ${algMap[alg]} -k -u ${cs} -p x --api-worker-id 127.0.0.1 --http-port ${API_PORT}`;
    },
  ),
];

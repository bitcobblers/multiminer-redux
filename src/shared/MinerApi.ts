/* eslint-disable @typescript-eslint/no-unused-vars */

import { AlgorithmKind, AlgorithmName, MinerName, MinerState } from '../models';

type ReceiveCallback = (data: string) => void;
type ExitedCallback = (code: number | void) => void;
type StartedCallback = (coin: string) => void;
type ErrorCallback = (message: string) => void;

export interface MinerApi {
  start: (
    profile: string,
    coin: string,
    miner: { name: MinerName; exe: string },
    version: string,
    args: string,
  ) => Promise<string | null>;
  stop: () => Promise<void>;
  status: () => Promise<MinerState>;
  stats: (port: number, args: string) => Promise<string>;
  receive: (callback: ReceiveCallback) => Promise<void>;
  exited: (callback: ExitedCallback) => Promise<void>;
  started: (callback: StartedCallback) => Promise<void>;
  error: (callback: ErrorCallback) => Promise<void>;
}

export const minerApi = {
  start: (
    _: string,
    __: string,
    ___: { name: MinerName; exe: string },
    ____: string,
    _____: string,
  ) => Promise.resolve(''),
  stop: () => Promise.resolve(),
  status: () => Promise.resolve({
    state: 'inactive',
    currentCoin: null,
    algorithm: {
      name: 'etchash' as AlgorithmName,
      kind: 'GPU' as AlgorithmKind,
    },
    profile: 'ignored',
    miner: 'lolminer' as MinerName,
  }),
  stats: (_: number, __: string) => Promise.resolve(''),
  receive: (_: ReceiveCallback) => Promise.resolve(),
  exited: (_: ExitedCallback) => Promise.resolve(),
  started: (_: StartedCallback) => Promise.resolve(),
  error: (_: ErrorCallback) => Promise.resolve(),
};

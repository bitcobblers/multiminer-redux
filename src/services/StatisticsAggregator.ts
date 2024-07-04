import { BehaviorSubject, filter, map, merge, withLatestFrom } from 'rxjs';
import { minerStarted$ } from './MinerService';
import {
  AVAILABLE_POOLS,
  CpuStatistic,
  GpuStatistic,
  MinerStatistic,
  minerState$,
} from '../models';

const gpuStatistics$ = new BehaviorSubject<GpuStatistic[]>([]);
const minerStatistics$ = new BehaviorSubject<MinerStatistic>({});

export const cpuStatistics$ = new BehaviorSubject<CpuStatistic>({});

export const currentHashrate$ = merge(minerStatistics$, cpuStatistics$).pipe(
  withLatestFrom(minerState$),
  filter(([, { state, miner }]) => state === 'active' && !!miner),
  map(([{ hashrate }, { miner }]) => ({
    hashrate,
    pool: AVAILABLE_POOLS.find((p) => p.name === miner!.pool),
  })),
  filter(({ hashrate, pool }) => !!hashrate && !!pool),
  map(({ hashrate, pool }) => ({
    scale: pool!.algorithm.scale ?? 'K',
    hashrate: hashrate!,
  })),
);

export const currentGpuSummary$ = minerStatistics$.pipe(
  withLatestFrom(minerState$),
  filter(([, { state, miner }]) => state === 'active' && !!miner),
  map(([summary, { miner }]) => ({
    summary,
    miner,
    pool: AVAILABLE_POOLS.find((p) => p.name === miner!.pool),
  })),
  filter(({ pool }) => !!pool),
  map(({ summary, pool }) => ({
    summary,
    pool: pool!,
  })),
);

export const currentGpuStats$ = gpuStatistics$.pipe(
  withLatestFrom(minerState$),
  filter(([, { state, miner }]) => state === 'active' && !!miner),
  map(([gpus, { miner }]) => ({
    gpus,
    miner,
    pool: AVAILABLE_POOLS.find((p) => p.name === miner!.pool),
  })),
  filter(({ pool }) => !!pool),
  map(({ gpus, pool }) => ({
    gpus,
    pool: pool!,
  })),
);

export function clearStatistics() {
  cpuStatistics$.next({});
  gpuStatistics$.next([]);
  minerStatistics$.next({});
}

export function addCpuStat(stat: CpuStatistic) {
  cpuStatistics$.next(stat);
}

export function addGpuStats(stats: GpuStatistic[]) {
  gpuStatistics$.next(stats);
}

export function addMinerStat(stat: MinerStatistic) {
  minerStatistics$.next(stat);
}

minerStarted$.subscribe(() => {
  clearStatistics();
});

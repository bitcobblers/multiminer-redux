import { BehaviorSubject, filter, map, merge, withLatestFrom } from 'rxjs';
import { minerStarted$ } from './MinerService';
import {
  AVAILABLE_MINERS,
  CpuStatistic,
  GpuStatistic,
  MinerStatistic,
  minerState$,
} from '../models';

export const cpuStatistics$ = new BehaviorSubject<CpuStatistic>({});
export const gpuStatistics$ = new BehaviorSubject<GpuStatistic[]>([]);
export const minerStatistics$ = new BehaviorSubject<MinerStatistic>({});

export const currentHashrate$ = merge(minerStatistics$, cpuStatistics$).pipe(
  withLatestFrom(minerState$),
  filter(([, { state }]) => state === 'active'),
  map(([{ hashrate }, { miner }]) => ({
    hashrate,
    miner: AVAILABLE_MINERS.find((m) => m.name === miner?.kind),
  })),
  filter(({ hashrate, miner }) => hashrate !== undefined && miner !== undefined),
  map(({ hashrate, miner }) => ({
    scale: miner!.kind === 'GPU' ? 'M' : ('K' as 'M' | 'K'),
    hashrate: hashrate!,
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

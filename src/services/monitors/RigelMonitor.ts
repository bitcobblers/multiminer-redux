import { addGpuStats, addMinerStat } from '../StatisticsAggregator';
import { MinerMonitor } from './MinerMonitor';

type SolutionStat = {
  accepted: number;
  rejected: number;
  invalid: number;
};

type HashrateAggregate = {
  autolykos2?: number;
  etchash?: number;
  ethash?: number;
  karlsenhash?: number;
  kawpow?: number;
  nexapow?: number;
  octopus?: number;
  pyrinhash?: number;
  sha512256d?: number;
  xelishash?: number;
};

type SolutionStatAggregate = {
  autolykos2?: SolutionStat;
  etchash?: SolutionStat;
  ethash?: SolutionStat;
  karlsenhash?: SolutionStat;
  kawpow?: SolutionStat;
  nexapow?: SolutionStat;
  octopus?: SolutionStat;
  pyrinhash?: SolutionStat;
  sha512256d?: SolutionStat;
  xelishash?: SolutionStat;
};

type PoolInfo = {
  id: number;
  connection_details: {
    protocol: string;
    username: string;
    password: string | null;
    worker: string | null;
    hostname: string;
    port: number;
    ssl: boolean;
    dns_mode: string;
  };
  state: {
    issued_job: string;
  };
  solution_stat: SolutionStat;
};

type MinerAppStatistics = {
  name: string;
  version: string;
  os_name: string;
  cuda_driver: string;
  uptime: number;
  algorithm: string;
  watchdog: string;
  pools: {
    autolykos2?: PoolInfo[];
    etchash?: PoolInfo[];
    ethash?: PoolInfo[];
    karlsenhash?: PoolInfo[];
    kawpow?: PoolInfo[];
    nexapow?: PoolInfo[];
    octopus?: PoolInfo[];
    pyrinhash?: PoolInfo[];
    sha512256d?: PoolInfo[];
    xelishash?: PoolInfo[];
  };
  devices: {
    id: number;
    selected: boolean;
    name: string;
    total_mem: number;
    pci_address: string;
    state: string;
    solution_stat: SolutionStatAggregate;
    monitoring_info: {
      core_temperature: number;
      memory_temperature: number;
      fan_speed: number;
      power_usage: number;
      core_clock: number;
      core_clock_offset: number;
      memory_clock: number;
      memory_clock_offset: number;
    };
    hashrate: HashrateAggregate;
    pool_hashrate: HashrateAggregate;
    dual_ratio: string;
    tune: {};
    crash_count: number;
  }[];
  solution_stat: SolutionStatAggregate;
  hashrate: HashrateAggregate;
  pool_hashrate: HashrateAggregate;
  power_usage: number;
};

function aggregateHashrates(hashrates: HashrateAggregate) {
  return Object.values(hashrates).reduce((acc, hashrate) => acc + (hashrate || 0), 0);
}

function aggregateStats(stats: SolutionStatAggregate) {
  return Object.values(stats).reduce(
    (acc, stat) => {
      if (!stat) {
        return acc;
      }

      return {
        accepted: acc.accepted + stat.accepted,
        rejected: acc.rejected + stat.rejected,
        invalid: acc.invalid + stat.invalid,
      };
    },
    { accepted: 0, rejected: 0, invalid: 0 },
  );
}

function updateStats(stats: MinerAppStatistics) {
  addGpuStats(
    stats.devices.map((device) => {
      const deviceStats = aggregateStats(device.solution_stat);
      const hashrate = aggregateHashrates(device.hashrate);
      const efficiency =
        hashrate === 0 || device.monitoring_info.power_usage === 0
          ? 0
          : hashrate / stats.power_usage;

      return {
        id: device.id.toString(),
        name: device.name,
        hashrate,
        accepted: deviceStats.accepted,
        rejected: deviceStats.rejected,
        power: device.monitoring_info.power_usage,
        efficiency,
        coreClock: device.monitoring_info.core_clock,
        coreTemperature: device.monitoring_info.core_temperature,
        memClock: device.monitoring_info.memory_clock,
        memTemperature: device.monitoring_info.memory_temperature,
        fanSpeed: device.monitoring_info.fan_speed,
      };
    }),
  );

  const totalStats = aggregateStats(stats.solution_stat);
  const totalHashrate = aggregateHashrates(stats.hashrate);
  const totalEfficiency =
    totalHashrate === 0 || stats.power_usage === 0 ? 0 : totalHashrate / stats.power_usage;

  addMinerStat({
    hashrate: totalHashrate,
    accepted: totalStats.accepted,
    rejected: totalStats.rejected,
    power: stats.power_usage,
    efficiency: totalEfficiency,
    uptime: stats.uptime,
  });
}

export const monitor: MinerMonitor = {
  name: 'rigel',
  statsUrls: [''],
  update: (stats) => updateStats(JSON.parse(stats[0])),
};

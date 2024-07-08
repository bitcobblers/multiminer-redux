import { addGpuStats, addMinerStat } from '../StatisticsAggregator';
import { MinerMonitor } from './MinerMonitor';

type MinerAppStatistics = {
  name: string;
  version: string;
  start_time: number;
  start_time_str: string;
  uptime_seconds: number;
  uptime_str: string;
  last_update: number;
  devices: {
    id: number;
    bus_id: number;
    name: string;
    vendor: string;
    cclk: number;
    mclk: number;
    temp: number;
    fan: number;
    power: number;
  }[];
  num_algos: number;
  algos: {
    id: number;
    name: string;
    session: {
      active: boolean;
      next_session: number;
    };
    pool: string;
    pool_status: string;
    hashrates: number[];
    total_hashrate: number;
    total_accepted_shares: number;
    total_rejected_shares: number;
    devices_accepted_shares: number[];
    devices_rejected_shares: number[];
  }[];
};

function updateStats(stats: MinerAppStatistics) {
  addGpuStats(
    stats.devices.map((device) => {
      const algos = stats.algos.filter(({ id }) => id === device.id);

      const accepted = algos.map((algo) => algo.total_accepted_shares).reduce((a, b) => a + b, 0);
      const rejected = algos.map((algo) => algo.total_rejected_shares).reduce((a, b) => a + b, 0);
      const hashrate = algos.map((algo) => algo.total_hashrate).reduce((a, b) => a + b, 0);
      const efficiency = hashrate === 0 || device.power === 0 ? 0 : hashrate / device.power;

      return {
        id: device.id.toString(),
        name: device.name,
        hashrate,
        accepted,
        rejected,
        power: device.power,
        efficiency,
        coreClock: device.cclk,
        coreTemperature: device.temp,
        memClock: device.mclk,
        memTemperature: 0,
        fanSpeed: device.fan,
      };
    }),
  );

  const totalHashrate = stats.algos.map((algo) => algo.total_hashrate).reduce((a, b) => a + b, 0);
  const totalPower = stats.devices.map((device) => device.power).reduce((a, b) => a + b, 0);

  const totalEfficiency = totalHashrate === 0 || totalPower === 0 ? 0 : totalHashrate / totalPower;

  const totalAccepted = stats.algos
    .map((algo) => algo.total_accepted_shares)
    .reduce((a, b) => a + b, 0);

  const totalRejected = stats.algos
    .map((algo) => algo.total_rejected_shares)
    .reduce((a, b) => a + b, 0);

  addMinerStat({
    hashrate: totalHashrate,
    accepted: totalAccepted,
    rejected: totalRejected,
    power: totalPower,
    efficiency: totalEfficiency,
    uptime: stats.uptime_seconds,
  });
}

export const monitor: MinerMonitor = {
  name: 'onezero',
  statsUrls: [''],
  update: (stats) => updateStats(JSON.parse(stats[0])),
};

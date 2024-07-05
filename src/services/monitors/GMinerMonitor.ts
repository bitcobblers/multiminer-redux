import { addGpuStats, addMinerStat } from '../StatisticsAggregator';
import { MinerMonitor } from './MinerMonitor';

type MinerAppStatistics = {
  miner: string;
  uptime: number;
  server: string;
  user: string;
  extended_share_info: boolean;
  shares_per_minute: number;
  pool_speed: number;
  algorithm: string;
  electricity: number;
  total_accepted_shares: number;
  total_rejected_shares: number;
  total_stale_shares: number;
  total_invalid_shares: number;
  devices: {
    gpu_id: number;
    bus_id: number;
    name: string;
    speed: number;
    accepted_shares: number;
    rejected_shares: number;
    stale_shares: number;
    invalid_shares: number;
    fan: number;
    temperature: number;
    temperature_limit: number;
    memory_temperature: number;
    memory_temperature_limit: number;
    core_clock: number;
    memory_clock: number;
    power_usage: number;
  }[];
  speed_rate_precision: number;
  speed_unit: string;
  power_unit: string;
};

function updateStats(stats: MinerAppStatistics) {
  addGpuStats(
    stats.devices.map((device) => {
      const hashrate = device.speed / 1000000;
      const efficiency =
        hashrate === 0 || device.power_usage === 0 ? 0 : (hashrate / device.power_usage) * 1000;

      return {
        id: device.gpu_id.toString(),
        name: device.name,
        hashrate,
        accepted: device.accepted_shares,
        rejected: device.rejected_shares,
        power: device.power_usage,
        efficiency,
        coreClock: device.core_clock,
        coreTemperature: device.temperature,
        memClock: device.memory_clock,
        memTemperature: device.memory_temperature,
        fanSpeed: device.fan,
      };
    }),
  );

  const totalHashrate = stats.devices.map((d) => d.speed).reduce((a, b) => a + b, 0) / 1000000;
  const totalPower = stats.devices.map((d) => d.power_usage).reduce((a, b) => a + b, 0);
  const totalEfficiency =
    totalHashrate === 0 || totalPower === 0 ? 0 : (totalHashrate / totalPower) * 1000;

  addMinerStat({
    hashrate: totalHashrate,
    accepted: stats.total_accepted_shares,
    rejected: stats.total_rejected_shares,
    power: totalPower,
    efficiency: totalEfficiency,
    uptime: stats.uptime,
  });
}

export const monitor: MinerMonitor = {
  name: 'gminer',
  statsUrls: ['stat'],
  update: (stats) => updateStats(JSON.parse(stats[0])),
};

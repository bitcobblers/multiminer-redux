import { addGpuStats, addMinerStat } from '../StatisticsAggregator';
import { MinerMonitor } from './MinerMonitor';

type MinerAppStatistics = {
  Software: string;
  Session: {
    Startup: number;
    Startup_String: string;
    Uptime: number;
    Last_Update: number;
  };
  Num_Workers: number;
  Workers: {
    Index: number;
    Name: string;
    Power: number;
    CCLK: number;
    MCLK: number;
    Core_Temp: number;
    Juc_Temp: number;
    Mem_Temp: number;
    Fan_Speed: number;
    PCIE_Address: string;
  }[];
  Num_Algorithms: number;
  Algorithms: {
    Algorithm: string;
    Algorithm_Appendix: string;
    Pool: string;
    User: string;
    Worker: string;
    Performance_Unit: string;
    Performance_Factor: number;
    Total_Performance: number;
    Total_Accepted: number;
    Total_Rejected: number;
    Total_Stales: number;
    Total_Errors: number;
    Worker_Performance: number[];
    Worker_Accepted: number[];
    Worker_Rejected: number[];
    Worker_Errors: number[];
  }[];
};

function updateStats(stats: MinerAppStatistics) {
  if (stats.Workers.toString() === '') {
    return;
  }

  addGpuStats(
    stats.Workers.map((worker) => {
      const hashrate = stats.Algorithms[0].Worker_Performance[worker.Index];
      const efficiency =
        hashrate === 0 || worker.Power === 0 ? 0 : (hashrate / worker.Power) * 1000;

      return {
        id: worker.Index.toString(),
        name: worker.Name,
        hashrate,
        accepted: stats.Algorithms[0].Worker_Accepted[worker.Index],
        rejected: stats.Algorithms[0].Worker_Rejected[worker.Index],
        power: worker.Power,
        efficiency,
        coreClock: worker.CCLK,
        memClock: worker.MCLK,
        coreTemperature: worker.Core_Temp,
        memTemperature: worker.Mem_Temp,
        fanSpeed: worker.Fan_Speed,
      };
    }),
  );

  const totalHashrate = stats.Algorithms[0].Total_Performance;
  const totalPower = stats.Workers.map((w) => w.Power).reduce((a, b) => a + b, 0);
  const totalEfficiency =
    totalHashrate === 0 || totalPower === 0 ? 0 : (totalHashrate / totalPower) * 1000;

  addMinerStat({
    hashrate: totalHashrate,
    accepted: stats.Algorithms[0].Total_Accepted,
    rejected: stats.Algorithms[0].Total_Rejected,
    power: totalPower,
    efficiency: totalEfficiency,
    uptime: stats.Session.Uptime,
  });
}

export const monitor: MinerMonitor = {
  name: 'lolminer',
  statsUrls: [''],
  update: (stats) => updateStats(JSON.parse(stats[0])),
};

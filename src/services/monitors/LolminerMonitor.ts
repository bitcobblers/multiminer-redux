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
      const hashrate = stats.Algorithms.map(
        (alg) => alg.Worker_Performance[worker.Index] * alg.Performance_Factor,
      ).reduce((a, b) => a + b, 0);

      const efficiency = hashrate === 0 || worker.Power === 0 ? 0 : hashrate / worker.Power;

      const accepted = stats.Algorithms.map((alg) => alg.Worker_Accepted[worker.Index]).reduce(
        (a, b) => a + b,
        0,
      );

      const rejected = stats.Algorithms.map((alg) => alg.Worker_Rejected[worker.Index]).reduce(
        (a, b) => a + b,
        0,
      );

      return {
        id: worker.Index.toString(),
        name: worker.Name,
        hashrate,
        accepted,
        rejected,
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

  const totalHashrate = stats.Algorithms.map(
    (alg) => alg.Total_Performance * alg.Performance_Factor,
  ).reduce((a, b) => a + b, 0);

  const totalPower = stats.Workers.map((w) => w.Power).reduce((a, b) => a + b, 0);
  const totalEfficiency = totalHashrate === 0 || totalPower === 0 ? 0 : totalHashrate / totalPower;
  const totalAccepted = stats.Algorithms.map((alg) => alg.Total_Accepted).reduce(
    (a, b) => a + b,
    0,
  );

  const totalRejected = stats.Algorithms.map((alg) => alg.Total_Rejected).reduce(
    (a, b) => a + b,
    0,
  );

  addMinerStat({
    hashrate: totalHashrate,
    accepted: totalAccepted,
    rejected: totalRejected,
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

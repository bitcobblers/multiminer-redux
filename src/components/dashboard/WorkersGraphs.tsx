import { useState, useEffect } from 'react';

import dateFormat from 'dateformat';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import { Tabs, Tab, Typography } from '@mui/material';
import { TabPanel } from '..';
import { AlgorithmStat, unmineableWorkers$ } from '../../services/UnmineableFeed';
import { useObservableState } from '../../hooks';
import { AlgorithmName, AVAILABLE_ALGORITHMS } from '../../models';

function shrink<T>(items: T[]) {
  let result = items;

  while (result.length > 150) {
    result = result.filter((_x, i) => i % 5 !== 0);
  }

  return result;
}

function WorkersGraph(props: {
  algorithm: string;
  stat: AlgorithmStat | undefined;
  scale: string;
}) {
  const { algorithm, stat, scale } = props;

  if (stat === undefined || stat.workers === undefined || stat.chart === undefined) {
    return <Typography>No data to display!</Typography>;
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: algorithm,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: `Hashrate ${scale}`,
        },
      },
    },
  };

  const chr = stat.workers
    .map((w) => w.chr)
    .reduce((previous, current) => Number(previous) + Number(current), 0);
  const rhr = stat.workers
    .map((w) => w.rhr)
    .reduce((previous, current) => Number(previous) + Number(current), 0);

  const timestamps = shrink(stat?.chart.calculated.timestamps).map((ts) =>
    dateFormat(new Date(ts), 'yyyy/mm/dd HH:MM:ss'),
  );
  const calculatedData = shrink(stat?.chart.calculated.data);
  const reportedData = shrink(stat?.chart.reported.data);

  const labels = timestamps;
  const data = {
    labels,
    datasets: [
      {
        label: `Calculated (${chr})`,
        data: calculatedData,
        borderColor: 'rgb(255,99,132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        lineTension: 0.5,
      },
      {
        label: `Reported(${rhr})`,
        data: reportedData,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        lineTension: 0.5,
      },
    ],
  };

  return <Line options={options} data={data} />;
}

export function WorkersGraphs() {
  const [tabIndex, setTabIndex] = useState(0);
  const [workers] = useObservableState(unmineableWorkers$, null);

  useEffect(() => {
    ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
  }, []);

  if (!workers) {
    return <p>No data to display!</p>;
  }

  const tabClicked = (_event: unknown, value: number) => {
    setTabIndex(value);
  };

  const populatedTabs = (Object.keys(workers) as AlgorithmName[])
    .filter((pool) => !!workers[pool]?.workers?.length)
    .map((pool, index) => ({
      pool,
      index,
      info: AVAILABLE_ALGORITHMS.find((a) => a.name === pool)!,
    }));

  return (
    <div>
      <Tabs value={tabIndex} onChange={tabClicked}>
        {populatedTabs.map((tab) => (
          <Tab key={tab.index} label={tab.pool} />
        ))}
      </Tabs>

      {populatedTabs.map(({ pool, index, info }) => (
        <TabPanel key={index} value={tabIndex} index={index}>
          <WorkersGraph algorithm={info.name} stat={workers[pool]} scale={info.scale} />
        </TabPanel>
      ))}
    </div>
  );
}

// UI.
import {
  Container,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import RefreshIcon from '@mui/icons-material/Cached';
import NextIcon from '@mui/icons-material/FastForward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Services.
import { useMemo, useState } from 'react';
import { AVAILABLE_POOLS, Miner, refreshData$ } from '../models';
import { startMiner, stopMiner, nextCoin } from '../services/MinerManager';

// Hooks.
import { useProfile, useMinerActive, useLoadData } from '../hooks';

// Screens.
import { ScreenHeader } from '../components';
import {
  CoinsTable,
  CpuComputeTable,
  CpuSummaryTable,
  GpuComputeTable,
  GpuSummaryTable,
  WorkersGraphs,
} from '../components/dashboard';

export function HomeScreen(): JSX.Element {
  const profile = useProfile();
  const minerActive = useMinerActive();
  const [miners, setLoadedMiners] = useState(Array<Miner>());

  useLoadData(async ({ getMiners }) => {
    setLoadedMiners(await getMiners());
  });

  const minerPool = useMemo(() => {
    const miner = miners.find((m) => m.name === profile);
    return miner ? AVAILABLE_POOLS.find((pool) => pool.name === miner.pool) : undefined;
  }, [profile]);

  const dashboards = [
    {
      header: 'Coins',
      component: <CoinsTable />,
      show: () => true,
    },
    {
      header: 'Summary',
      component: <GpuSummaryTable />,
      show: () => minerPool?.algorithm.kind === 'GPU',
    },
    {
      header: 'Summary',
      component: <CpuSummaryTable />,
      show: () => minerPool?.algorithm.kind === 'CPU',
    },
    {
      header: 'CPUs',
      component: <CpuComputeTable />,
      show: () => minerPool?.algorithm.kind === 'CPU',
    },
    {
      header: 'GPUs',
      component: <GpuComputeTable />,
      show: () => minerPool?.algorithm.kind === 'GPU',
    },
    {
      header: 'Graphs',
      component: <WorkersGraphs />,
      show: () => true,
    },
  ];

  return (
    <Container>
      <ScreenHeader title="Home">
        <Button
          startIcon={<PlayArrowIcon />}
          disabled={minerActive || !profile}
          onClick={async () => startMiner()}
        >
          Start Miner
        </Button>
        <Button startIcon={<StopIcon />} disabled={!minerActive} onClick={async () => stopMiner()}>
          Stop Miner
        </Button>
        <Button
          startIcon={<NextIcon />}
          disabled={!minerActive || !profile}
          onClick={async () => nextCoin()}
        >
          Next Coin
        </Button>
        <Button startIcon={<RefreshIcon />} onClick={() => refreshData$.next(Date.now())}>
          Refresh
        </Button>
      </ScreenHeader>
      {dashboards
        .filter((x) => x.show())
        .map((d) => (
          <Accordion key={d.header} defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="h5">{d.header}</Typography>
            </AccordionSummary>
            <AccordionDetails>{d.component}</AccordionDetails>
          </Accordion>
        ))}
    </Container>
  );
}

import { Box, Typography } from '@mui/material';
import { Separator } from '../Separator';
import { useObservableState, useMinerActive } from '../../hooks';
import { minerState$, downloadState$ } from '../../models';
import * as formatter from '../../services/Formatters';
import { currentHashrate$ } from '../../services/StatisticsAggregator';

function DownloadState(downloading: boolean) {
  return downloading && <>Downloading miner...</>;
}

function CurrentCoin(active: boolean, name: string | null | undefined) {
  return (
    active && (
      <>
        <strong>Coin</strong>: {name}
      </>
    )
  );
}

function HashRate(active: boolean, hashrate: number | undefined, scale?: 'M' | 'K') {
  return (
    active && (
      <>
        <strong>Hashrate</strong>: {formatter.hashrate(hashrate, scale)}
      </>
    )
  );
}

export function MinerSummary() {
  const [minerState] = useObservableState(minerState$, null);
  const [currentHashrate] = useObservableState(currentHashrate$, null);
  const [downloadState] = useObservableState(downloadState$, false);
  const minerActive = useMinerActive();

  const items = [
    DownloadState(downloadState),
    CurrentCoin(minerActive, minerState?.currentCoin),
    HashRate(minerActive, currentHashrate?.hashrate, currentHashrate?.scale),
  ].filter((x) => x);

  return (
    <Box>
      <Typography sx={{ mr: 2 }}>
        {items.length > 0 &&
          items.reduce((acc, x) =>
            acc === null ? (
              x
            ) : (
              <>
                {acc} <Separator /> {x}
              </>
            ),
          )}
      </Typography>
    </Box>
  );
}

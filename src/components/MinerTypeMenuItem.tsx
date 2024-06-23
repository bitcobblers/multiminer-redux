import { Grid, Typography } from '@mui/material';
import { MinerInfo, MiningPoolPortType } from '../models';

export interface AlgorithmMenuItemProps {
  miner: MinerInfo;
}

export function MinerTypeMenuItem(props: AlgorithmMenuItemProps) {
  const { miner } = props;

  return (
    <Grid container>
      <Grid item xs={3}>
        <Typography>{miner.friendlyName}</Typography>
      </Grid>
      <Grid>
        <Typography>{miner.kind}</Typography>
      </Grid>
    </Grid>
  );
}

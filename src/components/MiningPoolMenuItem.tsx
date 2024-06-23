import { Grid, Typography } from '@mui/material';
import { MiningPool } from '../models';

export interface MiningPoolMenuItemProps {
  pool: MiningPool;
}

export function MiningPoolMenuItem(props: MiningPoolMenuItemProps) {
  const { pool } = props;

  return (
    <Grid container>
      <Grid item xs={3}>
        <Typography>{pool.name}</Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography>{pool.algorithm.name}</Typography>
      </Grid>
      {pool.algorithm.minRam && (
        <Grid item xs={2}>
          <Typography>{pool.algorithm.minRam}GB</Typography>
        </Grid>
      )}
    </Grid>
  );
}

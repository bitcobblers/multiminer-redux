import { Grid, Typography } from '@mui/material';
import { MiningPoolPortType } from '../models';

export interface MiningPoolPortMenuItemProps {
  kind: MiningPoolPortType;
  port: number;
}

export function MiningPoolPortMenuItem(props: MiningPoolPortMenuItemProps) {
  const { kind, port } = props;

  return (
    <Grid container>
      <Grid item xs={3}>
        <Typography>{port}</Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography>{kind}</Typography>
      </Grid>
    </Grid>
  );
}

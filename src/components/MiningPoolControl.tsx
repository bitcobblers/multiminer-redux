import { Grid, TextField, ToggleButtonGroup, ToggleButton } from '@mui/material';

interface MiningPoolControlProps {
  name: string;
  url: string;
  tcpPorts: number[];
  sslPorts: number[];
}

export function MiningPoolControl(props: MiningPoolControlProps) {
  const { name, url, tcpPorts, sslPorts } = props;

  return (
    <Grid container sx={{ display: 'flex', alignItems: 'center' }}>
      <TextField disabled label={name} sx={{ width: 300 }} value={url} />
      <ToggleButtonGroup disabled size="large">
        {tcpPorts.map((port) => (
          <ToggleButton key={port} value={port}>
            {port}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <ToggleButtonGroup disabled size="large">
        {sslPorts.map((port) => (
          <ToggleButton key={port} value={port}>
            {port} (SSL)
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Grid>
  );
}

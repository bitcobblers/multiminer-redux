/* eslint-disable react/no-array-index-key */
import {
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Typography,
} from '@mui/material';
import * as formatter from '../../services/Formatters';
import { cpuStatistics$ } from '../../services/StatisticsAggregator';
import { useObservableState } from '../../hooks';

export function CpuComputeTable() {
  const [cpu] = useObservableState(cpuStatistics$, null);

  if (cpu === null || !cpu.timings) {
    return <Typography>No data to display!</Typography>;
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Hashrate</TableCell>
            {cpu.timings.map((_t, index) => (
              <TableCell key={index}>{index}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>10s</TableCell>
            {cpu.timings.map((t, i) => (
              <TableCell key={i}>{formatter.hashrate(t.tenSeconds, 'H/s')}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>60s</TableCell>
            {cpu.timings.map((t, i) => (
              <TableCell key={i}>{formatter.hashrate(t.sixtySeconds, 'H/s')}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>15m</TableCell>
            {cpu.timings.map((t, i) => (
              <TableCell key={i}>{formatter.hashrate(t.fifteenMinutes, 'H/s')}</TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

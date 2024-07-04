import {
  Table,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Typography,
} from '@mui/material';
import * as formatter from '../../services/Formatters';
import { currentGpuSummary$ } from '../../services/StatisticsAggregator';
import { useObservableState } from '../../hooks';

export function GpuSummaryTable() {
  const [miner] = useObservableState(currentGpuSummary$, null);

  if (!miner) {
    return <Typography>No data to display!</Typography>;
  }

  const { summary, pool } = miner;
  const { hashrate, accepted, rejected, power, efficiency, difficulty, uptime } = summary;

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Hashrate</TableCell>
            <TableCell>Found</TableCell>
            <TableCell>Shares</TableCell>
            <TableCell>Power</TableCell>
            <TableCell>Efficiency</TableCell>
            <TableCell>Difficulty</TableCell>
            <TableCell>Uptime</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>{formatter.hashrate(hashrate, pool.algorithm.scale)}</TableCell>
            <TableCell>{formatter.found(accepted, rejected)}</TableCell>
            <TableCell>{formatter.shares(accepted, rejected)}</TableCell>
            <TableCell>{formatter.power(power)}</TableCell>
            <TableCell>
              {formatter.efficiency(efficiency, pool.algorithm.efficiencyScale)}
            </TableCell>
            <TableCell>{formatter.difficulty(difficulty)}</TableCell>
            <TableCell>{formatter.uptime(uptime)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

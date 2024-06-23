import { useState } from 'react';
import { v4 as uuid } from 'uuid';

import {
  Container,
  Box,
  Button,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Table,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from 'notistack';

import { Miner, MinerRelease } from '../models';
import { setMiners, getAppSettings, setAppSettings } from '../services/SettingsService';

import { ScreenHeader, EditMinerControls } from '../components';
import { EditMinerDialog } from '../dialogs/EditMinerDialog';
import { useLoadData, useProfile } from '../hooks';

const getEmptyMiner = (): Partial<Miner> => ({
  id: uuid(),
  kind: 'lolminer',
  name: '',
});

export function MinersScreen() {
  const { enqueueSnackbar } = useSnackbar();
  const [newOpen, setNewOpen] = useState(false);
  const [newMiner, setNewMiner] = useState(getEmptyMiner());
  const [miners, setLoadedMiners] = useState(Array<Miner>());
  const [availableMiners, setAvailableMiners] = useState(Array<MinerRelease>());
  const profile = useProfile();

  useLoadData(async ({ getMiners, getMinerReleases }) => {
    setLoadedMiners(await getMiners());
    setAvailableMiners(await getMinerReleases());
  });

  const handleOnAddMiner = () => {
    setNewOpen(true);
  };

  const saveMiner = async (miner: Miner) => {
    const index = miners.findIndex((m) => m.id === miner.id);
    const updatedMiners = [...miners];

    updatedMiners.splice(index, 1);
    updatedMiners.splice(index, 0, miner);

    await setMiners(updatedMiners);
    setLoadedMiners(updatedMiners);

    enqueueSnackbar(`Miner ${miner.name} updated.`, { variant: 'success' });
  };

  const addMiner = async (miner: Miner) => {
    const updatedMiners = miners.concat(miner);

    await setMiners(updatedMiners);

    setNewMiner(getEmptyMiner);
    setLoadedMiners(updatedMiners);
    setNewOpen(false);

    enqueueSnackbar(`Miner ${miner.name} added.`, { variant: 'success' });
  };

  const removeMiner = async (name: string, id: string) => {
    const updatedMiners = [...miners.filter((m) => m.id !== id)];

    await setMiners(updatedMiners);
    setLoadedMiners(updatedMiners);

    enqueueSnackbar(`Miner ${name} removed.`, { variant: 'success' });
  };

  const setDefaultMiner = async (name: string) => {
    const appSettings = await getAppSettings();
    appSettings.settings.defaultMiner = name;
    await setAppSettings(appSettings);
  };

  return (
    <Container>
      <ScreenHeader title="Miners">
        <Button startIcon={<AddIcon />} onClick={handleOnAddMiner}>
          Add Miner
        </Button>
      </ScreenHeader>
      <Box
        sx={{
          '& .MuiDataGrid-cell--editing': {
            bgcolor: 'rgb(255,215,115, 0.19)',
            color: '#1a3e72',
          },
          '& .Mui-error': {
            bgcolor: (theme) => `rgb(126,10,15, ${theme.palette.mode === 'dark' ? 0 : 0.1})`,
            color: (theme) => (theme.palette.mode === 'dark' ? '#ff4343' : '#750f0f'),
          },
        }}
      >
        <EditMinerDialog
          key="edit-new-miner"
          open={newOpen}
          miner={newMiner}
          existingMiners={miners}
          availableMiners={availableMiners}
          autoReset
          onSave={addMiner}
          onCancel={() => setNewOpen(false)}
        />
        <TableContainer>
          <Table aria-label="Miners">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Default</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Miner</TableCell>
                <TableCell>Version</TableCell>
                <TableCell>Pool</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {miners.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <EditMinerControls
                      miner={m}
                      isDefault={profile === m.name}
                      onSave={saveMiner}
                      existingMiners={miners}
                      availableMiners={availableMiners}
                      onRemove={removeMiner}
                    />
                  </TableCell>
                  <TableCell>
                    {m.name === profile ? (
                      <Button variant="outlined" size="small" disabled>
                        Default
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setDefaultMiner(m.name)}
                      >
                        Set Default
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>{m.name}</TableCell>
                  <TableCell>{m.kind}</TableCell>
                  <TableCell>{m.version}</TableCell>
                  <TableCell>{m.pool}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}

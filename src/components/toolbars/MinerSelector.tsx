import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import { AVAILABLE_MINERS, MinerName } from '../../models';
import { useLoadData, useObservableState, useProfile } from '../../hooks';
import { getAppSettings, setAppSettings, watchers$ } from '../../services/SettingsService';

export function MinerSelector() {
  const [miners, setLoadedMiners] = useObservableState(watchers$.miners, []);

  useLoadData(async ({ getMiners }) => {
    getMiners()
      .then(setLoadedMiners)
      .catch((err) => console.error('Failed to load miners: ', err));
  });

  const profile = useProfile();

  const setDefaultMiner = async (name: string) => {
    const appSettings = await getAppSettings();
    await setAppSettings({
      ...appSettings,
      settings: { ...appSettings.settings, defaultMiner: name },
    });
  };

  const getMinerFriendlyName = (kind: MinerName) =>
    AVAILABLE_MINERS.find((m) => m.name === kind)?.friendlyName ?? kind;

  return (
    <FormControl size="small" sx={{ minWidth: '12rem' }}>
      <InputLabel id="miner-label">Miner</InputLabel>
      <Select
        labelId="miner-label"
        sx={{ fontSize: '0.8rem' }}
        label="Miner"
        disabled={miners.length === 0}
        value={miners.length > 0 ? profile : 'ignored'}
        onChange={($event) => setDefaultMiner($event.target.value)}
      >
        {miners.length > 0 ? (
          miners
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(({ name, kind }) => (
              <MenuItem key={name} value={name}>
                {name} ({getMinerFriendlyName(kind)})
              </MenuItem>
            ))
        ) : (
          <MenuItem value="ignored">No miners defined</MenuItem>
        )}
      </Select>
    </FormControl>
  );
}

import {
  Button,
  Container,
  Divider,
  FormControl,
  Stack,
  TextField,
  Typography,
  MenuItem,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import SaveIcon from '@mui/icons-material/Save';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { open as openDlg, save as saveDlg } from '@tauri-apps/api/dialog';
import { info, error } from 'tauri-plugin-log-api';
import { appLogDir } from '@tauri-apps/api/path';
import { invoke } from '@tauri-apps/api';
import { AppSettings, DefaultSettings } from '../models';
import { ConfigurableControl, ScreenHeader } from '../components';
import { setAppSettings, importSettings, exportSettings } from '../services/SettingsService';
import { useLoadData } from '../hooks';
import { MiningPoolControl } from '../components/MiningPoolControl';
import { AVAILABLE_POOLS } from '../models/MiningPools';

// react-hook-form's API requires prop spreading to register controls
/* eslint-disable react/jsx-props-no-spreading */
export function SettingsScreen() {
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    formState: { errors, isValid, isDirty },
    handleSubmit,
    reset,
    watch,
  } = useForm<AppSettings>({
    defaultValues: DefaultSettings.settings,
    mode: 'all',
  });

  useLoadData(async ({ getAppSettings }) => {
    getAppSettings()
      .then((s) => reset(s))
      .catch((errorMessage) => {
        enqueueSnackbar(`Unable to load settings: ${errorMessage}`, { variant: 'error' });
        error(`Unable to load settings: ${errorMessage}`);
      });
  });

  const onSave = handleSubmit(async (value) => {
    await setAppSettings(value);
    enqueueSnackbar('Settings updated.', {
      variant: 'success',
    });

    reset(value);
  });

  const onReset = async () => {
    await setAppSettings(DefaultSettings.settings);
    enqueueSnackbar('Settings restored to defaults.', {
      variant: 'success',
    });

    reset(DefaultSettings.settings);
  };

  const onExport = async () => {
    const path = await saveDlg({
      defaultPath: '.',
      filters: [{ name: 'JSON', extensions: ['json'] }],
    });

    if (!path) {
      return;
    }

    info(`exporting settings to: ${path}`);
    const result = await exportSettings(path);

    if (result) {
      enqueueSnackbar('Settings exported', { variant: 'success' });
    } else {
      enqueueSnackbar(`Export settings failed: ${result}.`, { variant: 'error' });
    }
  };

  const onImport = async () => {
    const path = (await openDlg({
      defaultPath: '.',
      filters: [{ name: 'JSON', extensions: ['json'] }],
      multiple: false,
      directory: false,
    })) as string | null;

    if (!path) {
      return;
    }

    const result = await importSettings(path);

    if (result) {
      enqueueSnackbar('Settings imported', { variant: 'success' });
    } else {
      enqueueSnackbar(`Import settings failed: ${result}.`, { variant: 'error' });
    }
  };

  const onOpenLogs = async () => {
    const logFolder = await appLogDir();
    await invoke('open_folder', { path: logFolder });
  };

  const pickCoinStrategy = (current: string) => (current === undefined ? 'normal' : current);

  const DefaultSpacing = 2;

  return (
    <Container>
      <ScreenHeader title="Settings">
        <Button startIcon={<DownloadIcon />} onClick={onExport}>
          Export
        </Button>
        <Button startIcon={<UploadIcon />} onClick={onImport}>
          Import
        </Button>
        <Button startIcon={<SettingsBackupRestoreIcon />} onClick={() => onReset()}>
          Restore Defaults
        </Button>
        <Button startIcon={<OpenInNewIcon />} onClick={() => onOpenLogs()}>
          Open Logs
        </Button>
      </ScreenHeader>
      <Typography variant="h5" sx={{ my: 2 }}>
        General Settings
      </Typography>
      <FormControl fullWidth>
        <Stack direction="column" spacing={DefaultSpacing} sx={{ width: '17.7rem' }}>
          <ConfigurableControl description="The name that uniquely identifies this worker.">
            <TextField
              required
              spellCheck="false"
              label="Worker Name"
              fullWidth
              {...register('settings.workerName', {
                required: 'A worker name must be provided.',
                maxLength: {
                  value: 30,
                  message: 'A worker name cannot be more than 30 characters long.',
                },
                pattern: {
                  value: /^[a-zA-Z0-9\-_]+/,
                  message:
                    "The worker name must only contain letters numbers, or a '-' and '_' symbol.",
                },
              })}
              error={!!errors?.settings?.workerName}
              helperText={errors?.settings?.workerName?.message}
            />
          </ConfigurableControl>
        </Stack>
        <Stack sx={{ width: '17.7rem', mt: 2 }}>
          <ConfigurableControl description="How should the app pick the next coin to mine.">
            <TextField
              label="Coin Strategy"
              select
              value={pickCoinStrategy(watch('settings.coinStrategy'))}
              {...register('settings.coinStrategy')}
            >
              <MenuItem value="normal">Normal (next coin in the list)</MenuItem>
              <MenuItem value="skynet">Skynet (let the app decide)</MenuItem>
            </TextField>
          </ConfigurableControl>
        </Stack>
        <Divider sx={{ mt: 2 }} />
        <Typography variant="h5" sx={{ my: 2 }}>
          Mining Pools
        </Typography>
        <Stack direction="column" spacing={DefaultSpacing}>
          {AVAILABLE_POOLS.map((pool) => (
            <MiningPoolControl
              key={pool.name}
              name={pool.name}
              url={pool.url}
              tcpPorts={pool.tcpPorts}
              sslPorts={pool.sslPorts}
            />
          ))}
        </Stack>
        <Divider sx={{ mt: 2, mb: 1 }} />
        <Stack direction="row">
          <Button startIcon={<SaveIcon />} disabled={!isValid || !isDirty} onClick={onSave}>
            Save Changes
          </Button>
        </Stack>
      </FormControl>
    </Container>
  );
}

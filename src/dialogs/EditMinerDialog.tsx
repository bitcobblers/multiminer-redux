/* eslint-disable react/jsx-props-no-spreading */

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import Dialog from '@mui/material/Dialog';
import {
  DialogTitle,
  DialogContent,
  TextField,
  Stack,
  MenuItem,
  FormControl,
  Divider,
  Button,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { open as openExternal } from '@tauri-apps/api/shell';
import { AVAILABLE_MINERS, AVAILABLE_POOLS, Miner, MinerInfo, MinerRelease } from '../models';
import { MinerTypeMenuItem } from '../components/MinerTypeMenuItem';
import {
  MiningPoolPortMenuItem,
  MiningPoolPortMenuItemProps,
} from '../components/MiningPoolPortMenuItem';
import { MiningPoolMenuItem } from '../components/MiningPoolMenuItem';
import { CustomDialogActions } from './CustomDialogActions';

type EditMinerDialogProps = {
  open: boolean;
  miner: Partial<Miner>;
  existingMiners: Miner[];
  availableMiners: MinerRelease[];
  autoReset: boolean;
  onSave: (miner: Miner) => void;
  onCancel: () => void;
};

export function EditMinerDialog(props: EditMinerDialogProps) {
  const { open, miner, existingMiners, availableMiners, autoReset, onSave, onCancel, ...other } =
    props;

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<Omit<Miner, 'id'>>({ defaultValues: miner, mode: 'all' });

  const kind = watch('kind');
  const poolName = watch('pool');

  const minerPools = useMemo(() => {
    const selectedMiner = AVAILABLE_MINERS.find((m) => m.name === kind);
    const selectedMinerAlgorithms = selectedMiner?.algorithms ?? [];
    return AVAILABLE_POOLS.filter((pool) => selectedMinerAlgorithms.includes(pool.algorithm.name));
  }, [kind]);

  const miningPoolPorts = useMemo(() => {
    const selectedPool = minerPools.find((pool) => pool.name === poolName);
    const tcpPorts = selectedPool?.tcpPorts ?? [];
    const sslPorts = selectedPool?.sslPorts ?? [];

    return [
      ...tcpPorts.map(
        (p) =>
          ({
            kind: 'tcp',
            port: p,
          }) as MiningPoolPortMenuItemProps,
      ),
      ...sslPorts.map(
        (p) =>
          ({
            kind: 'ssl',
            port: p,
          }) as MiningPoolPortMenuItemProps,
      ),
    ];
  }, [poolName]);

  const minerTypeVersions = useMemo(() => {
    const selectedMiner = availableMiners.find((m) => m.name === kind);
    return selectedMiner?.versions.map((r) => r.tag) ?? [];
  }, [availableMiners, kind]);

  const availableMinersAsMinerInfo = useMemo(
    () =>
      availableMiners
        .map((m) => AVAILABLE_MINERS.find((x) => x.name === m.name))
        .filter((m) => m !== undefined) as MinerInfo[],
    [availableMiners],
  );

  const pickPool = (current: string | undefined) => {
    if (current && minerPools.find((pool) => pool.name === current)) {
      return current;
    }

    return minerPools[0].name;
  };

  const pickPort = (current: number | undefined) => {
    if (
      current &&
      minerPools.find(({ tcpPorts, sslPorts }) => [...tcpPorts, ...sslPorts].includes(current))
    ) {
      return current;
    }

    return minerPools[0].tcpPorts[0];
  };

  const pickVersion = (current: string | undefined) => {
    if (!current || minerTypeVersions.includes(current) === false) {
      return minerTypeVersions[0];
    }

    return current;
  };

  const handleOnSave = handleSubmit((val) => {
    const version = pickVersion(watch('version'));
    const pool = pickPool(watch('pool'));
    const port = pickPort(watch('port'));

    const updatedMiner = {
      ...val,
      id: miner.id!,
      version,
      pool,
      port,
    };

    onSave(updatedMiner);

    if (autoReset) {
      reset(miner);
    } else {
      reset(updatedMiner);
    }
  });

  const handleOnCancel = () => {
    reset(miner);
    onCancel();
  };

  const openReference = () => {
    const currentMiner = availableMinersAsMinerInfo.find((m) => m.name === kind);

    if (currentMiner !== undefined) {
      openExternal(currentMiner.optionsUrl);
    }
  };

  return (
    <Dialog sx={{ '& .MuiDialog-paper': { width: '550px' } }} open={open} {...other}>
      <DialogTitle sx={{ textAlign: 'center' }}>Edit Miner</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleOnSave}>
          <FormControl fullWidth>
            <Stack spacing={2}>
              <TextField
                required
                autoFocus
                spellCheck="false"
                label="Name"
                value={watch('name') ?? null}
                {...register('name', {
                  required: 'A miner must have a name',
                  validate: (val) =>
                    existingMiners.filter((m) => m.id !== miner.id).find((m) => m.name === val)
                      ? 'A miner already exists with the same name.'
                      : undefined,
                })}
                error={!!errors?.name}
                helperText={errors?.name?.message}
              />
              <TextField label="Miner" select value={watch('kind')} {...register('kind')}>
                {availableMinersAsMinerInfo
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((m) => (
                    <MenuItem key={m.name} value={m.name}>
                      <MinerTypeMenuItem miner={m} />
                    </MenuItem>
                  ))}
              </TextField>
              <TextField
                label="Version"
                select
                value={pickVersion(watch('version'))}
                {...register('version')}
              >
                {minerTypeVersions.map((version) => (
                  <MenuItem key={version} value={version}>
                    {version}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Mining Pool"
                select
                value={pickPool(watch('pool'))}
                {...register('pool')}
              >
                {minerPools.map((pool) => (
                  <MenuItem key={pool.name} value={pool.name}>
                    <MiningPoolMenuItem pool={pool} />
                  </MenuItem>
                ))}
              </TextField>
              <TextField label="Port" select value={pickPort(watch('port'))} {...register('port')}>
                {miningPoolPorts.map(({ kind: portKind, port }) => (
                  <MenuItem key={port} value={port}>
                    <MiningPoolPortMenuItem kind={portKind} port={port} />
                  </MenuItem>
                ))}
              </TextField>
              <Stack direction="row" gap={1} alignItems="center">
                <TextField
                  style={{ width: '22rem' }}
                  spellCheck="false"
                  label="Parameters"
                  {...register('parameters')}
                  value={watch('parameters') ?? ''}
                />
                <Button
                  startIcon={<OpenInNewIcon />}
                  size="large"
                  variant="outlined"
                  onClick={openReference}
                >
                  Reference
                </Button>
              </Stack>
              <Divider />
              <CustomDialogActions
                buttonType="submit"
                onCancel={handleOnCancel}
                primaryButtonDisabled={!isValid || !isDirty}
              />
            </Stack>
          </FormControl>
        </form>
      </DialogContent>
    </Dialog>
  );
}

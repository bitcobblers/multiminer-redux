import { useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import { Stack, Tooltip, IconButton } from '@mui/material';

import { Miner, MinerRelease, downloadState$ } from '../models';
import { RemoveMinerDialog } from '../dialogs/RemoveMinerDialog';
import { EditMinerDialog } from '../dialogs/EditMinerDialog';
import { ensureMiner } from '../services/DownloadManager';
import { useObservableState } from '../hooks';

interface EditMinerControlsProps {
  miner: Miner;
  // eslint-disable-next-line react/require-default-props
  isDefault?: boolean;
  existingMiners: Miner[];
  availableMiners: MinerRelease[];
  onSave: (miner: Miner) => void;
  onRemove: (name: string, id: string) => void;
}

export function EditMinerControls(props: EditMinerControlsProps) {
  const { miner, isDefault, existingMiners, availableMiners, onSave, onRemove } = props;
  const [editOpen, setEditOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [downloadState] = useObservableState(downloadState$, false);

  const handleOnEditClick = () => {
    setEditOpen(true);
  };

  const handleOnRemoveClick = () => {
    setRemoveOpen(true);
  };

  const handleEditCancel = () => {
    setEditOpen(false);
  };

  const handleEditSave = (updatedMiner: Miner) => {
    onSave(updatedMiner);
    setEditOpen(false);
  };

  const handleRemoveClose = (result: boolean) => {
    if (result === true) {
      onRemove(miner.name, miner.id);
    }

    setRemoveOpen(false);
  };

  const handleDownload = () => {
    const { kind, version } = miner;

    return ensureMiner(kind, version, true);
  };

  return (
    <Stack direction="row" spacing={1}>
      <RemoveMinerDialog open={removeOpen} onClose={handleRemoveClose} />
      <EditMinerDialog
        open={editOpen}
        miner={miner}
        existingMiners={existingMiners}
        availableMiners={availableMiners}
        autoReset={false}
        onSave={handleEditSave}
        onCancel={handleEditCancel}
      />
      <Tooltip
        title={
          isDefault
            ? 'Cannot remove miner because it is currently selected as the default miner.'
            : 'Delete Miner'
        }
      >
        <span>
          <IconButton aria-label="Delete Miner" disabled={isDefault} onClick={handleOnRemoveClick}>
            <DeleteIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Edit Miner">
        <IconButton aria-label="Edit Miner" onClick={handleOnEditClick}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Download">
        <span>
          <IconButton aria-label="Download Miner" disabled={downloadState} onClick={handleDownload}>
            <DownloadIcon />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
}

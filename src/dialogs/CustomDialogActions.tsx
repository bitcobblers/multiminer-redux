/* eslint-disable react/require-default-props */
import { DialogActions, Button } from '@mui/material';

interface CustomDialogActionsProps {
  onCancel: () => unknown;
  onConfirm?: () => unknown;
  buttonType?: 'submit' | 'button' | 'reset';
  buttonText?: string;
  secondaryButtonText?: string;
  primaryButtonDisabled?: boolean;
}

export function CustomDialogActions(
  props: CustomDialogActionsProps = {
    onCancel: () => {},
    onConfirm: undefined,
    primaryButtonDisabled: undefined,
    buttonType: 'button',
    buttonText: 'Save',
    secondaryButtonText: 'Cancel',
  },
) {
  const {
    onConfirm,
    onCancel,
    buttonType,
    buttonText,
    secondaryButtonText,
    primaryButtonDisabled,
  } = props;

  return (
    <DialogActions
      sx={{ mt: '0.4rem', display: 'flex', '& .MuiButton-root': { flex: 1, height: '3rem' } }}
    >
      <Button
        onClick={() => onConfirm?.()}
        type={buttonType ?? 'button'}
        disabled={primaryButtonDisabled}
      >
        {buttonText ?? 'Save'}
      </Button>
      <Button onClick={() => onCancel()} color="error">
        {secondaryButtonText ?? 'Cancel'}
      </Button>
    </DialogActions>
  );
}

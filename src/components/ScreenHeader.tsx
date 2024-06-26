import { Divider, Typography, Box } from '@mui/material';
import { PropsWithChildren } from 'react';
import { ThemeToggle } from './ThemeToggle';

export function ScreenHeader(props: PropsWithChildren<{ title: string }>) {
  const { title, children } = props;
  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ pt: '0.8rem', display: 'flex', justifyContent: 'space-between' }}
      >
        <span>{title}</span>
        <ThemeToggle />
      </Typography>
      <Divider />
      <Box sx={{ my: '0.6rem', display: 'flex', '& .MuiButton-root': { minWidth: '8.8rem' } }}>
        {children}
      </Box>
      {children ? <Divider /> : <></>}
    </>
  );
}

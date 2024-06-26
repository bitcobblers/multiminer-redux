import { useEffect, useState, useRef, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { from } from 'rxjs';
import { mergeWith } from 'rxjs/operators';
import './App.css';

// Material.
import { BugReport } from '@mui/icons-material';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import {
  Button,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Drawer,
  List,
  Box,
  PaletteMode,
  ListItemButton,
} from '@mui/material';
import { SnackbarProvider, SnackbarKey, useSnackbar } from 'notistack';
import { lightGreen, teal } from '@mui/material/colors';

// Navigation Icons.
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import MonitorIcon from '@mui/icons-material/Monitor';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import { open as openExternal } from '@tauri-apps/api/shell';

import { Toolbar } from './components/Toolbar';
import { appNotice$, addAppNotice } from './models';
import { useObservable } from './hooks';
import {
  HomeScreen,
  WalletsScreen,
  CoinsScreen,
  MinersScreen,
  MonitorScreen,
  SettingsScreen,
  AboutScreen,
} from './screens';
import { minerExited$, minerStarted$ } from './services/MinerService';
import { getAppTheme, watchers$ } from './services/SettingsService';

const drawerWidth = 200;

const links = [
  { id: 0, to: '/', icon: <HomeIcon />, text: 'Home', screen: <HomeScreen /> },
  {
    id: 1,
    to: '/wallets',
    icon: <AccountBalanceWalletIcon />,
    text: 'Wallets',
    screen: <WalletsScreen />,
  },
  { id: 2, to: '/coins', icon: <AddShoppingCartIcon />, text: 'Coins', screen: <CoinsScreen /> },
  { id: 3, to: '/miners', icon: <RocketLaunchIcon />, text: 'Miners', screen: <MinersScreen /> },
  { id: 4, to: '/monitor', icon: <MonitorIcon />, text: 'Monitor', screen: <MonitorScreen /> },
  { id: 5, to: '/settings', icon: <SettingsIcon />, text: 'Settings', screen: <SettingsScreen /> },
  { id: 6, to: '/about', icon: <InfoIcon />, text: 'About', screen: <AboutScreen /> },
];

function NavLink(props: { id: number; to: string; icon: JSX.Element; text: string }) {
  const { id, to, icon, text } = props;
  const theme = useTheme();

  return (
    <Link key={id} to={to} style={{ textDecoration: 'none' }}>
      <ListItemButton sx={{ color: theme.palette.text.primary }}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </Link>
  );
}

function NavScreen(props: { id: number; to: string; screen: JSX.Element }) {
  const { id, to, screen } = props;

  return <Route key={id} path={to} element={screen} />;
}

function safeReverse<T>(items: Array<T>) {
  return [...items].reverse();
}

function AppContent() {
  const { enqueueSnackbar } = useSnackbar();

  useObservable(appNotice$, ({ variant, message }) => enqueueSnackbar(message, { variant }));
  useObservable(minerStarted$, ({ coin }) =>
    addAppNotice('success', `Miner is now mining ${coin}`),
  );
  useObservable(minerExited$, () => addAppNotice('default', 'Miner exited.'));

  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <Drawer
          style={{ width: drawerWidth, display: 'flex' }}
          sx={{
            '& .MuiPaper-root': {
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'stretch',
            },
          }}
          variant="persistent"
          open
        >
          <List style={{ width: drawerWidth }}>{links.map(NavLink)}</List>
          <div style={{ textAlign: 'center', marginBottom: '0.4rem' }}>
            <Button
              variant="text"
              size="small"
              startIcon={<BugReport />}
              onClick={() =>
                openExternal('https://github.com/bitcobblers/multiminer/issues/new/choose')
              }
            >
              Report a bug
            </Button>
          </div>
        </Drawer>
        <Box
          sx={{
            marginBottom: '3.5rem',
            flex: 1,
            '& .MuiContainer-root': { ml: 0, maxWidth: '99%' },
          }}
        >
          <Routes>{safeReverse(links).map(NavScreen)}</Routes>
        </Box>
        <Toolbar drawerWidth={drawerWidth} />
      </Box>
    </Router>
  );
}

export function App() {
  const snackRef = useRef<SnackbarProvider>(null);

  const closeSnack = (key: SnackbarKey) => () => {
    snackRef.current?.closeSnackbar(key);
  };

  const [themeMode, setThemeMode] = useState<PaletteMode>();
  useEffect(() => {
    const subscription = from(getAppTheme())
      .pipe(mergeWith(watchers$.theme))
      .subscribe((theme) => setThemeMode(theme));
    return () => subscription.unsubscribe();
  }, []);

  const mdTheme = useMemo(() => {
    const isDark = themeMode === 'dark';
    return createTheme({
      components: {
        MuiChip: {
          styleOverrides: {
            root: {
              marginLeft: '2px',
              marginRight: '2px',
            },
          },
        },
      },
      palette: {
        primary: isDark ? lightGreen : teal,
        text: {
          primary: isDark ? '#C9D1D9' : 'rgba(0, 0, 0, 0.87);',
        },
        mode: themeMode,
      },
    });
  }, [themeMode]);

  const dismissButton = (key: SnackbarKey) => <Button onClick={closeSnack(key)}>Dismiss</Button>;

  return (
    <ThemeProvider theme={mdTheme}>
      <SnackbarProvider
        maxSnack={5}
        ref={snackRef}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        action={dismissButton}
      >
        <CssBaseline />
        <AppContent />
      </SnackbarProvider>
    </ThemeProvider>
  );
}

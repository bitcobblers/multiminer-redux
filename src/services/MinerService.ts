import { Subject } from 'rxjs';
import { info } from 'tauri-plugin-log-api';
import { appLocalDataDir, join } from '@tauri-apps/api/path';
import { invoke } from '@tauri-apps/api';
import { UnlistenFn, listen } from '@tauri-apps/api/event';
import { MinerInfo, addAppNotice } from '../models';

export const stdout$ = new Subject<string>();
export const minerExited$ = new Subject<number | void>();
export const minerStarted$ = new Subject<{ coin: string }>();

let stopOutputListener: UnlistenFn | null = null;
let stopErrorListener: UnlistenFn | null = null;
let stopExitedListener: UnlistenFn | null = null;

export async function startMiner(coin: string, miner: MinerInfo, version: string, args: string) {
  const localDir = await appLocalDataDir();
  const minerPath = await join(localDir, 'miners', miner.name, version, miner.exe);

  info(`Starting miner from ${minerPath} with the following parameters: ${args}`);
  await invoke('run_miner', {
    path: minerPath,
    args,
  });

  minerStarted$.next({ coin });
}

export async function stopMiner() {
  if (await invoke('is_miner_running')) {
    info('Stopping miner.');
    await invoke('stop_miner');
  }
}

export async function enableMinerOutputListener() {
  stopOutputListener = await listen<{ message: string }>('miner-output', (event) => {
    const { message } = event.payload;

    message
      .replace(/(\r\n)/gm, '\n')
      .trim()
      .split('\n')
      .filter((l) => l !== '')
      .forEach((l) => {
        stdout$.next(l);
      });
  });

  stopErrorListener = await listen<{ error: string }>('miner-error', (event) => {
    const { error } = event.payload;
    addAppNotice('error', error);
  });

  stopExitedListener = await listen<{ code: number }>('miner-exited', (event) => {
    const { code } = event.payload;
    minerExited$.next(code);
  });
}

export async function disableMinerOutputListener() {
  await stopMiner();

  if (stopOutputListener) {
    stopOutputListener();
  }

  if (stopErrorListener) {
    stopErrorListener();
  }

  if (stopExitedListener) {
    stopExitedListener();
  }
}

// minerApi.started((coin: string) => {
//   minerStarted$.next({ coin });
// });

// minerApi.exited((code: number | void) => {
//   minerExited$.next(code);
// });

// minerApi.error((message: string) => {
//   addAppNotice('error', message);
// });

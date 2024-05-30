import { Subject } from 'rxjs';
import { info } from 'tauri-plugin-log-api';
import { appLocalDataDir, join } from '@tauri-apps/api/path';
import { invoke } from '@tauri-apps/api';
import { UnlistenFn, listen } from '@tauri-apps/api/event';
import { MinerInfo } from '../models';

export const stdout$ = new Subject<string>();
export const minerExited$ = new Subject<number | void>();
export const minerStarted$ = new Subject<{ coin: string }>();

let stopListener: UnlistenFn | null = null;

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
    minerExited$.next();
  }
}

export async function enableMinerOutputListener() {
  stopListener = await listen<{ message: string }>('miner-output', (event) => {
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
}

export async function disableMinerOutputListener() {
  await stopMiner();

  if (stopListener) {
    stopListener();
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

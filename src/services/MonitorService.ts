import { interval, withLatestFrom, map, filter } from 'rxjs';
import { debug, error, warn } from 'tauri-plugin-log-api';
import { ResponseType, fetch } from '@tauri-apps/api/http';
import { minerState$, API_PORT } from '../models';
import {
  gminerMonitor,
  lolminerMonitor,
  nbminerMonitor,
  onezeroMonitor,
  rigelMonitor,
  trexminerMonitor,
  xmrigMonitor,
} from './monitors';

const UPDATE_INTERVAL = 1000 * 5;
const monitor$ = interval(UPDATE_INTERVAL);

export function enableMonitors() {
  const monitors = [
    gminerMonitor,
    lolminerMonitor,
    nbminerMonitor,
    onezeroMonitor,
    rigelMonitor,
    trexminerMonitor,
    xmrigMonitor,
  ];

  const monitorNames = monitors.map((m) => m.name);

  monitor$
    .pipe(
      withLatestFrom(minerState$),
      filter(([, { state, miner }]) => state === 'active' && !!miner),
      map(([, { miner }]) => miner!),
    )
    .subscribe(async (miner) => {
      const monitor = monitors.find((m) => m.name === miner.kind);

      if (monitor) {
        const results = await Promise.allSettled(
          monitor.statsUrls.map(async (url) => {
            const fullUrl = `http://localhost:${API_PORT}/${url}`;
            const response = await fetch<string>(fullUrl, {
              method: 'GET',
              responseType: ResponseType.Text,
            });

            if (response.ok) {
              return response.data;
            }

            error(`REST call to ${fullUrl} failed with ${response.status}.`);
            return null;
          }),
        );

        const stats = results
          .filter(({ status }) => status === 'fulfilled')
          .map((p) => p as PromiseFulfilledResult<string | null>)
          .map((p) => p?.value as string)
          .filter((content) => content);

        if (stats.length !== monitor.statsUrls.length) {
          warn(`Failed to fetch stats for ${monitor.name}.`);
        } else {
          monitor.update(stats);
        }
      }
    });

  debug(`Enabled miner monitor support for: ${monitorNames.join(', ')}.`);
}

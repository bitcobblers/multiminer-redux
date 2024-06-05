import { ReplaySubject, timer, throttleTime } from 'rxjs';
import { ResponseType, fetch } from '@tauri-apps/api/http';
import { error } from 'tauri-plugin-log-api';
import { ALL_COINS, refreshData$ } from '../models';
import * as config from './SettingsService';

export type CoinTicker = {
  symbol: string;
  price: number;
};

export const ticker$ = new ReplaySubject<CoinTicker[]>();

const REFRESH_THROTTLE = 1000 * 30;
const MILLISECONDS_PER_MINUTE = 1000 * 60;
const UPDATE_INTERVAL = 5 * MILLISECONDS_PER_MINUTE;
const TICKER_URL = 'https://api.coingecko.com/api/v3/simple/price';

const updater$ = timer(0, UPDATE_INTERVAL);

async function getTicker(coins: string[]) {
  const content = await fetch<string>(`${TICKER_URL}?ids=${coins.join(',')}&vs_currencies=USD`, {
    method: 'GET',
    responseType: ResponseType.Text,
  });

  if (content.ok) {
    return content.data;
  }

  return null;
}

export async function updateTicker() {
  const coins = (await config.getCoins()).filter((c) => c.enabled);
  const ids = coins
    .map((c) => ALL_COINS.find((cd) => cd.symbol === c.symbol)?.id ?? '')
    .filter((c) => c !== '');
  const result = Array<CoinTicker>();

  if (ids.length === 0) {
    return;
  }

  const content = await getTicker(ids);

  if (!content) {
    error('Failed to fetch ticker data');
    return;
  }

  const response = JSON.parse(content);

  Object.keys(response).forEach((k) => {
    // This call should never fail.
    const symbol = ALL_COINS.find((c) => c.id === k)?.symbol;

    if (symbol) {
      result.push({ symbol, price: response[k].usd });
    }
  });

  if (result.length > 0) {
    ticker$.next(result);
  }
}

updater$.subscribe(() => {
  updateTicker();
});

refreshData$.pipe(throttleTime(REFRESH_THROTTLE)).subscribe(() => {
  updateTicker();
});

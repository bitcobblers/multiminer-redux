import { debug } from 'tauri-plugin-log-api';
import { Coin, ALL_COINS, MinerState, minerState$, enabledCoins$ } from '../models';
import * as config from './SettingsService';
import { CoinTicker, ticker$ } from './CoinFeed';
import { UnmineableCoin, unmineableCoins$ } from './UnmineableFeed';

function minerStateChanged(state: MinerState) {
  debug(`Miner state changed to ${state.state}`);

  const updatedCoins = enabledCoins$.getValue().map((c) => ({
    ...c,
    current: state.state === 'active' ? state.currentCoin === c.symbol : false,
  }));

  enabledCoins$.next(updatedCoins);
}

function tickerUpdated(coins: CoinTicker[]) {
  debug('Updating coins from ticker feed.');

  const updatedCoins = enabledCoins$.getValue().map((c) => {
    const ticker = coins.find((t) => t.symbol === c.symbol);

    if (ticker === null) {
      return c;
    }

    return {
      ...c,
      price: ticker?.price,
    };
  });

  enabledCoins$.next(updatedCoins);
}

function unmineableCoinsUpdated(coins: UnmineableCoin[]) {
  debug('Updating coins from unmineable feed.');

  const updatedCoins = enabledCoins$.getValue().map((c) => {
    const ticker = coins.find((t) => t.symbol === c.symbol);

    if (ticker === undefined) {
      return c;
    }

    return {
      ...c,
      ...{
        mined: ticker.balance,
        threshold: ticker.threshold,
      },
    };
  });

  enabledCoins$.next(updatedCoins);
}

function reloadCoins(coins: Coin[]) {
  debug('Reloading coins from configuration.');

  const updateCoins = async () => {
    const { currentCoin } = minerState$.getValue();
    const previouslyLoadedCoins = enabledCoins$.getValue();
    const wallets = await config.getWallets();

    return coins
      .filter((c) => c.enabled)
      .map((c) => {
        const cd = ALL_COINS.find((x) => x.symbol === c.symbol);
        const wallet = wallets.find((w) => c.wallet === w.id);

        const previousCoin = previouslyLoadedCoins.find((x) => x.symbol === c.symbol);
        return {
          current: currentCoin === c.symbol,
          icon: cd?.icon ?? '',
          symbol: c.symbol,
          price: previousCoin?.price,
          mined: previousCoin?.mined,
          threshold: previousCoin?.threshold,
          duration: Number(c.duration),
          address: wallet?.address ?? '',
        };
      });
  };

  updateCoins().then((updatedCoins) => enabledCoins$.next(updatedCoins));
}

const minerStateSubscription = minerState$.subscribe(minerStateChanged);
const tickerSubscription = ticker$.subscribe(tickerUpdated);
const unmineableCoinsSubscription = unmineableCoins$.subscribe(unmineableCoinsUpdated);
const configWatcherSubscription = config.watchers$.coins.subscribe(reloadCoins);

export function cleanup() {
  debug('Cleaning up data service.');

  minerStateSubscription.unsubscribe();
  tickerSubscription?.unsubscribe();

  unmineableCoinsSubscription?.unsubscribe();
  configWatcherSubscription?.unsubscribe();
}

export async function enableDataService() {
  const loadedCoins = (await config.getCoins()).filter((c) => c.enabled);
  const wallets = await config.getWallets();

  enabledCoins$.next(
    loadedCoins.map((c) => {
      const cd = ALL_COINS.find((x) => x.symbol === c.symbol);
      const wallet = wallets.find((w) => c.wallet === w.id);

      return {
        current: false,
        icon: cd?.icon ?? '',
        symbol: c.symbol,
        duration: Number(c.duration),
        address: wallet?.address ?? '',
      };
    }),
  );
}

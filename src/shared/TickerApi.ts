/* eslint-disable @typescript-eslint/no-unused-vars */

export interface TickerApi {
  getTicker: (coins: string[]) => Promise<string>;
}

export const tickerApi = {
  getTicker: (_: string[]) => Promise.resolve(''),
};

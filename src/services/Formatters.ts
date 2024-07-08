/* eslint-disable @typescript-eslint/indent */
import { HashrateUnit, HashrateEfficiencyUnit } from '../models';

export function number(value: number | null | undefined, maxDigits = 8) {
  return value === undefined || value === null
    ? 'N/A'
    : value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: maxDigits });
}

export function currency(value: number | null | undefined, maxDigits = 2) {
  return !value
    ? 'N/A'
    : value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: maxDigits,
      });
}

export function hashrate(value: number | undefined | null, scale?: HashrateUnit) {
  if (!value) {
    return 'N/A';
  }

  switch (scale) {
    case 'KH/s':
      return `${number(value / 1000, 2)}${scale}`;
    case 'MH/s':
      return `${number(value / 1000000, 2)}${scale}`;
    case 'GH/s':
      return `${number(value / 1000000000, 2)}${scale}`;
    case 'Sol/s':
      return `${number(value, 1)}${scale}`;
    default:
      return `${number(value, 0)}H/s`;
  }
}

export function shares(accepted: number | undefined, rejected: number | undefined) {
  return `${number(accepted ?? 0)} / ${number(rejected ?? 0)}`;
}

export function found(accepted: number | undefined, rejected: number | undefined) {
  return number((accepted ?? 0) + (rejected ?? 0));
}

export function power(value: number | null | undefined) {
  return !value ? 'N/A' : `${number(value, 2)}W`;
}

export function efficiency(value: number | null | undefined, scale?: HashrateEfficiencyUnit) {
  if (!value || !scale) {
    return 'N/A';
  }

  switch (scale) {
    case 'H/W':
      return `${number(value, 2)}${scale}`;
    case 'KH/W':
      return `${number(value / 1000, 2)}${scale}`;
    case 'MH/W':
      return `${number(value / 1000000, 2)}${scale}`;
    case 'GH/W':
      return `${number(value / 1000000000, 2)}${scale}`;
    case 'Sol/W':
      return `${number(value, 1)}${scale}`;
    default:
      return `${number(value, 2)}`;
  }

  return !value ? 'N/A' : `${number(value, 2)}${scale ?? ''}`;
}

export function clockSpeed(speed: number | null | undefined) {
  return !speed ? 'N/A' : `${speed.toLocaleString()}MHz`;
}

export function temperature(value: number | null | undefined) {
  return !value ? 'N/A' : `${value}°`;
}

export function percentage(percent: number | null | undefined) {
  return !percent ? 'N/A' : `${number(percent, 2)}%`;
}

export function difficulty(value: string | null | undefined) {
  return !value ? 'N/A' : `${value}`;
}

export function progress(mined: number | undefined, threshold: number | undefined) {
  return mined === undefined || threshold === undefined || mined === 0 || threshold === 0
    ? 0
    : (100 * mined) / threshold;
}

export function minedValue(mined: number | undefined, price: number | undefined) {
  return mined === undefined || price === undefined ? currency(0) : currency(mined * price);
}

export function uptime(value: number | null | undefined) {
  if (!value) {
    return 'N/A';
  }

  const SECONDS_PER_MINUTE = 60;
  const SECONDS_PER_HOUR = 3600;
  const SECONDS_PER_DAY = 86400;

  const flooredValue = Math.floor(value);

  const totalDays = Math.floor(flooredValue / SECONDS_PER_DAY);
  const totalHours = Math.floor((flooredValue - totalDays * SECONDS_PER_DAY) / SECONDS_PER_HOUR);
  const totalMinutes = Math.floor(
    (flooredValue - totalDays * SECONDS_PER_DAY - totalHours * SECONDS_PER_HOUR) /
      SECONDS_PER_MINUTE,
  );
  const totalSeconds =
    flooredValue -
    totalDays * SECONDS_PER_DAY -
    totalHours * SECONDS_PER_HOUR -
    totalMinutes * SECONDS_PER_MINUTE;

  const daysStr = totalDays ? `${totalDays}d` : '';
  const hoursStr = totalHours ? `${totalHours}hr` : '';
  const minutesStr = totalMinutes ? `${totalMinutes}min` : '';
  const secondsStr = totalSeconds ? `${totalSeconds}s` : '';

  const parts = [daysStr, hoursStr, minutesStr, secondsStr].filter((x) => x !== '');

  return parts.join(' ');
}

export function duration(value: number | undefined) {
  if (value === undefined) {
    return 'N/A';
  }

  const HOURS_PER_DAY = 24;
  const HOURS_PER_WEEK = 168;

  const flooredValue = Math.floor(value);

  const totalWeeks = Math.floor(flooredValue / HOURS_PER_WEEK);
  const totalDays = Math.floor((flooredValue - totalWeeks * HOURS_PER_WEEK) / HOURS_PER_DAY);
  const totalHours = flooredValue - totalWeeks * HOURS_PER_WEEK - totalDays * HOURS_PER_DAY;

  const weeksStr = totalWeeks ? `${totalWeeks}w` : '';
  const daysStr = totalDays ? `${totalDays}d` : '';
  const hoursStr = totalHours ? `${totalHours}hr` : '';

  const parts = [weeksStr, daysStr, hoursStr].filter((x) => x !== '');

  return parts.join(' ');
}

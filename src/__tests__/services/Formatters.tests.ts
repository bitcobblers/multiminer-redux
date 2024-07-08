import { HashrateEfficiencyUnit, HashrateUnit } from '../../models';
import * as formatter from '../../services/Formatters';

describe('Formatters Service', () => {
  describe('Hashrate For Empty Values', () => {
    const cases = [null, undefined];

    test.each(cases)('%p', (given) => {
      // Act.
      const result = formatter.hashrate(given);

      // Assert.
      expect(result).toBe('N/A');
    });
  });

  describe('Hashrate Scaling', () => {
    const cases: { scale?: HashrateUnit; given: number; expected: string }[] = [
      { scale: undefined, given: 10, expected: '10H/s' },
      { scale: 'KH/s', given: 1000, expected: '1KH/s' },
      { scale: 'MH/s', given: 1000000, expected: '1MH/s' },
      { scale: 'GH/s', given: 1000000000, expected: '1GH/s' },
      { scale: 'Sol/s', given: 1, expected: '1Sol/s' },
    ];

    test.each(cases)('%p', ({ scale, given, expected }) => {
      // Act.
      const result = formatter.hashrate(given, scale);

      // Assert.
      expect(result).toBe(expected);
    });
  });

  describe('Power', () => {
    const cases = [
      { given: undefined, expected: 'N/A' },
      { given: null, expected: 'N/A' },
      { given: 0, expected: '0W' },
      { given: 1, expected: '1W' },
      { given: 1.5, expected: '1.5W' },
    ];

    test.each(cases)('%p', ({ given, expected }) => {
      // Act.
      const result = formatter.power(given);

      // Assert.
      expect(result).toBe(expected);
    });
  });

  describe('Efficiency For Empty Values', () => {
    const cases: { value?: number | null; scale?: HashrateEfficiencyUnit }[] = [
      { value: null, scale: 'H/W' },
      { value: undefined, scale: 'H/W' },
      { value: 1, scale: undefined },
    ];

    test.each(cases)('%p', ({ value, scale }) => {
      // Act.
      const result = formatter.efficiency(value, scale);

      // Assert.
      expect(result).toBe('N/A');
    });
  });

  describe('Efficiency Scaling', () => {
    const cases: { scale?: HashrateEfficiencyUnit; given: number; expected: string }[] = [
      { given: 1, expected: 'N/A' },
      { scale: 'H/W', given: 1, expected: '1H/W' },
      { scale: 'KH/W', given: 1000, expected: '1KH/W' },
      { scale: 'MH/W', given: 1000000, expected: '1MH/W' },
      { scale: 'GH/W', given: 1000000000, expected: '1GH/W' },
      { scale: 'Sol/W', given: 1, expected: '1Sol/W' },
    ];

    test.each(cases)('%p', ({ scale, given, expected }) => {
      // Act.
      const result = formatter.efficiency(given, scale);

      // Assert.
      expect(result).toBe(expected);
    });
  });

  describe('Clock Speed', () => {
    const cases = [
      { given: undefined, expected: 'N/A' },
      { given: null, expected: 'N/A' },
      { given: 0, expected: '0MHz' },
      { given: 1, expected: '1MHz' },
      { given: 1000, expected: '1,000MHz' },
    ];

    test.each(cases)('%p', ({ given, expected }) => {
      // Act.
      const result = formatter.clockSpeed(given);

      // Assert.
      expect(result).toBe(expected);
    });
  });

  describe('Temperature', () => {
    const cases = [
      { given: undefined, expected: 'N/A' },
      { given: null, expected: 'N/A' },
      { given: 0, expected: '0°' },
      { given: 1, expected: '1°' },
      { given: 1.5, expected: '1.5°' },
    ];

    test.each(cases)('%p', ({ given, expected }) => {
      // Act.
      const result = formatter.temperature(given);

      // Assert.
      expect(result).toBe(expected);
    });
  });

  describe('Percentage', () => {
    const cases = [
      { given: undefined, expected: 'N/A' },
      { given: null, expected: 'N/A' },
      { given: 0, expected: '0%' },
      { given: 0.5, expected: '0.5%' },
      { given: 1, expected: '1%' },
      { given: 1.5, expected: '1.5%' },
    ];

    test.each(cases)('%p', ({ given, expected }) => {
      // Act.
      const result = formatter.percentage(given);

      // Assert.
      expect(result).toBe(expected);
    });
  });

  describe('Difficulty', () => {
    const cases = [
      { given: undefined, expected: 'N/A' },
      { given: null, expected: 'N/A' },
      { given: '1', expected: '1' },
      { given: '1.5', expected: '1.5' },
    ];

    test.each(cases)('%p', ({ given, expected }) => {
      // Act.
      const result = formatter.difficulty(given);

      // Assert.
      expect(result).toBe(expected);
    });
  });

  describe('Uptime', () => {
    const cases = [
      { given: undefined, expected: 'N/A' },
      { given: null, expected: 'N/A' },
      { given: 1, expected: '1s' },
      { given: 1.5, expected: '1s' },
      { given: 60, expected: '1min' },
      { given: 60.5, expected: '1min' },
      { given: 90, expected: '1min 30s' },
      { given: 3600, expected: '1hr' },
      { given: 3600.5, expected: '1hr' },
      { given: 3601, expected: '1hr 1s' },
      { given: 3660, expected: '1hr 1min' },
      { given: 3690, expected: '1hr 1min 30s' },
      { given: 86400, expected: '1d' },
      { given: 86400.5, expected: '1d' },
      { given: 86401, expected: '1d 1s' },
      { given: 86460, expected: '1d 1min' },
      { given: 86490, expected: '1d 1min 30s' },
      { given: 90000, expected: '1d 1hr' },
      { given: 90001, expected: '1d 1hr 1s' },
      { given: 90060, expected: '1d 1hr 1min' },
      { given: 90090, expected: '1d 1hr 1min 30s' },
    ];

    test.each(cases)('%p', ({ given, expected }) => {
      // Act.
      const result = formatter.uptime(given);

      // Assert.
      expect(result).toBe(expected);
    });
  });

  describe('Duration', () => {
    const cases = [
      { given: undefined, expected: 'N/A' },
      { given: 1, expected: '1hr' },
      { given: 24, expected: '1d' },
      { given: 30, expected: '1d 6hr' },
      { given: 168, expected: '1w' },
      { given: 192, expected: '1w 1d' },
      { given: 193, expected: '1w 1d 1hr' },
    ];

    test.each(cases)('%p', ({ given, expected }) => {
      // Act.
      const result = formatter.duration(given);

      // Assert.
      expect(result).toBe(expected);
    });
  });
});

import { describe, expect, it } from 'vitest';
import { formatTimestamp, formatMessageTime } from '../date';

describe('date utils', () => {
  describe('formatTimestamp', () => {
    it('returns "Agora" for recent timestamps', () => {
      const now = Date.now();
      expect(formatTimestamp(now)).toBe('Agora');
    });

    it('returns "Ontem" for yesterday timestamps', () => {
      const yesterday = Date.now() - 24 * 60 * 60 * 1000;
      expect(formatTimestamp(yesterday)).toBe('Ontem');
    });

    it('returns date for older timestamps', () => {
      const oldDate = new Date('2023-01-01').getTime();
      expect(formatTimestamp(oldDate)).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });

    it('handles undefined timestamp', () => {
      expect(formatTimestamp(undefined)).toBe('');
    });
  });

  describe('formatMessageTime', () => {
    it('formats time in HH:mm format', () => {
      const timestamp = new Date('2024-03-15 14:30:00').getTime();
      expect(formatMessageTime(timestamp)).toMatch(/^\d{2}:\d{2}$/);
    });

    it('pads single digit hours and minutes', () => {
      const timestamp = new Date('2024-03-15 09:05:00').getTime();
      expect(formatMessageTime(timestamp)).toBe('09:05');
    });
  });
}); 
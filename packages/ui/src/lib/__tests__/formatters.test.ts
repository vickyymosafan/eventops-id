import { describe, expect, it } from 'vitest';
import { formatRentangJam, formatRupiah, formatTanggalIndo } from '../formatters';

describe('@eventops/ui formatters', () => {
  it('formats IDR integer amounts without decimal trailing zeros', () => {
    expect(formatRupiah(50_000_000)).toBe('Rp50.000.000');
    expect(formatRupiah(0)).toBe('Rp0');
    expect(formatRupiah(-250_000)).toBe('-Rp250.000');
  });

  it('formats Indonesian dates in event timezone', () => {
    const iso = '2027-06-20T01:00:00.000Z'; // 08.00 WIB
    expect(formatTanggalIndo(iso, 'ASIA_JAKARTA', 'short')).toBe('20 Jun 2027');
    expect(formatTanggalIndo(iso, 'ASIA_JAKARTA', 'full')).toBe(
      'Minggu, 20 Juni 2027',
    );
  });

  it('formats time ranges with EYD dot separator and WIB/WITA/WIT label', () => {
    const start = '2027-06-20T01:00:00.000Z'; // 08.00 WIB / 09.00 WITA / 10.00 WIT
    const end = '2027-06-20T02:15:00.000Z'; // 09.15 WIB / 10.15 WITA / 11.15 WIT
    expect(formatRentangJam(start, end, 'ASIA_JAKARTA')).toBe('08.00–09.15 WIB');
    expect(formatRentangJam(start, end, 'ASIA_MAKASSAR')).toBe('09.00–10.15 WITA');
    expect(formatRentangJam(start, end, 'ASIA_JAYAPURA')).toBe('10.00–11.15 WIT');
  });
});

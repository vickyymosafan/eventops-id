import { TIMEZONE_META, type IndonesiaTimezone } from '@eventops/contracts/common';

const RUPIAH_FORMATTER = new Intl.NumberFormat('id-ID', {
  maximumFractionDigits: 0,
});

/**
 * Memformat bilangan Rupiah utuh sesuai standar EventOps (`Rp50.000.000`).
 */
export function formatRupiah(amountIdr: number): string {
  const safeInt = Math.trunc(amountIdr);
  if (safeInt < 0) {
    return `-Rp${RUPIAH_FORMATTER.format(Math.abs(safeInt))}`;
  }
  return `Rp${RUPIAH_FORMATTER.format(safeInt)}`;
}

/**
 * Memformat tanggal ke Bahasa Indonesia sesuai zona waktu acara (`WIB`, `WITA`, `WIT`).
 */
export function formatTanggalIndo(
  input: string | Date,
  timezone: IndonesiaTimezone = 'ASIA_JAKARTA',
  variant: 'short' | 'full' = 'short',
): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  const tzMeta = TIMEZONE_META[timezone];

  const options: Intl.DateTimeFormatOptions =
    variant === 'full'
      ? {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          timeZone: tzMeta.iana,
        }
      : {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          timeZone: tzMeta.iana,
        };

  return new Intl.DateTimeFormat('id-ID', options).format(date);
}

/**
 * Memformat rentang jam dengan titik pemisah EYD V dan label zona (`08.00–09.15 WIB`).
 */
export function formatRentangJam(
  startInput: string | Date,
  endInput: string | Date,
  timezone: IndonesiaTimezone = 'ASIA_JAKARTA',
): string {
  const start = typeof startInput === 'string' ? new Date(startInput) : startInput;
  const end = typeof endInput === 'string' ? new Date(endInput) : endInput;
  const tzMeta = TIMEZONE_META[timezone];

  const timeFormatter = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: tzMeta.iana,
  });

  const formatHm = (d: Date) => timeFormatter.format(d).replace(':', '.');
  return `${formatHm(start)}–${formatHm(end)} ${tzMeta.label}`;
}

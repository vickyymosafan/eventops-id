import { z } from 'zod';

/** Zona waktu resmi Nusantara (disinkronkan dengan enum Prisma IndonesiaTimezone). */
export const IndonesiaTimezoneSchema = z.enum([
  'ASIA_JAKARTA',
  'ASIA_MAKASSAR',
  'ASIA_JAYAPURA',
]);

export type IndonesiaTimezone = z.infer<typeof IndonesiaTimezoneSchema>;

export const TIMEZONE_META: Record<
  IndonesiaTimezone,
  { iana: string; label: string; utcOffset: string }
> = {
  ASIA_JAKARTA: {
    iana: 'Asia/Jakarta',
    label: 'WIB',
    utcOffset: 'UTC+7',
  },
  ASIA_MAKASSAR: {
    iana: 'Asia/Makassar',
    label: 'WITA',
    utcOffset: 'UTC+8',
  },
  ASIA_JAYAPURA: {
    iana: 'Asia/Jayapura',
    label: 'WIT',
    utcOffset: 'UTC+9',
  },
};

/**
 * Nominal Rupiah utuh (tanpa float/desimal) sesuai hard invariant keuangan EventOps.
 */
export const IdrAmountSchema = z
  .number()
  .int('Nominal Rupiah harus bilangan bulat tanpa desimal')
  .nonnegative('Nominal Rupiah tidak boleh negatif')
  .max(100_000_000_000, 'Nominal melebihi batas transaksi maksimum');

export const PositiveIdrAmountSchema = IdrAmountSchema.refine(
  (value) => value > 0,
  'Nominal harus lebih besar dari Rp0',
);

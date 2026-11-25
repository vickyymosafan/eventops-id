/**
 * Konfigurasi environment publik aplikasi web.
 * Tidak menyimpan rahasia server; mode mock hanya aktif jika secara eksplisit diaktifkan.
 */
export const clientEnv = {
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || 'http://localhost:4000',
  useMockApi: process.env.NEXT_PUBLIC_USE_MOCK_API === 'true',
} as const;

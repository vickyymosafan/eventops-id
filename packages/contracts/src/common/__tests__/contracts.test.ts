import { describe, expect, it } from 'vitest';
import {
  ApiErrorResponseSchema,
  createApiSuccessSchema,
  IdrAmountSchema,
  LoginInputSchema,
  OrganizationOverviewSchema,
  TIMEZONE_META,
} from '../../index';

describe('@eventops/contracts foundation', () => {
  it('validates IDR amounts as whole non-negative integers without floats', () => {
    expect(IdrAmountSchema.safeParse(50_000_000).success).toBe(true);
    expect(IdrAmountSchema.safeParse(0).success).toBe(true);
    expect(IdrAmountSchema.safeParse(12500.5).success).toBe(false);
    expect(IdrAmountSchema.safeParse(-1000).success).toBe(false);
  });

  it('maps Indonesian timezones to WIB/WITA/WIT labels', () => {
    expect(TIMEZONE_META.ASIA_JAKARTA.label).toBe('WIB');
    expect(TIMEZONE_META.ASIA_MAKASSAR.label).toBe('WITA');
    expect(TIMEZONE_META.ASIA_JAYAPURA.label).toBe('WIT');
  });

  it('wraps data in standard /api/v1 success and error envelopes', () => {
    const schema = createApiSuccessSchema(OrganizationOverviewSchema);
    const valid = schema.safeParse({
      success: true,
      data: {
        organization: {
          id: '0195c8d0-7a12-7000-91ab-8812ef901122',
          name: 'Kreasi Nusantara EO',
          slug: 'kreasi-nusantara',
          planName: 'Pro Event',
          role: 'OWNER',
          memberCount: 18,
          activeEventCount: 3,
        },
        quota: {
          planName: 'Pro Event',
          activeEventsUsed: 3,
          activeEventsLimit: 10,
          membersUsed: 18,
          membersLimit: 50,
        },
        metrics: {
          activeEvents: 3,
          eventsNeedAttention: 1,
          overdueTasksAcrossOrg: 4,
          totalCommittedBudgetIdr: 85_000_000,
        },
        upcomingEvents: [],
      },
      meta: {
        requestId: 'req_01TEST',
        timestamp: '2027-06-01T09:15:00.000Z',
      },
    });
    expect(valid.success).toBe(true);

    const errValid = ApiErrorResponseSchema.safeParse({
      success: false,
      error: {
        code: 'RESOURCE_BOOKING_CONFLICT',
        message: 'Stok proyektor tidak mencukupi pada rentang waktu yang dipilih.',
        details: [{ field: 'quantity', issue: 'Sisa 1 unit' }],
      },
      meta: {
        requestId: 'req_02TEST',
        timestamp: '2027-06-01T09:16:00.000Z',
      },
    });
    expect(errValid.success).toBe(true);
  });

  it('rejects short passwords in Indonesian login validation', () => {
    const res = LoginInputSchema.safeParse({
      email: 'panitia@eventops.id',
      password: '123',
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0]?.message).toContain('minimal 8 karakter');
    }
  });
});

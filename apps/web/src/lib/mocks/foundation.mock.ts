import type {
  AuthSessionUser,
  LoginResponseData,
  OrganizationOverview,
} from '@eventops/contracts';

export const MOCK_USER: AuthSessionUser = {
  id: '0195c8d0-1111-7000-91ab-000000000001',
  fullName: 'Raka Pratama',
  email: 'raka@kreasinusantara.id',
  avatarUrl: null,
  organizations: [
    {
      organizationId: '0195c8d0-2222-7000-91ab-000000000001',
      organizationName: 'Kreasi Nusantara EO',
      organizationSlug: 'kreasi-nusantara',
      role: 'OWNER',
    },
  ],
};

export const MOCK_LOGIN_RESPONSE: LoginResponseData = {
  accessToken: 'mock-access-token-eventops-dev',
  user: MOCK_USER,
};

export const MOCK_ORG_OVERVIEW: OrganizationOverview = {
  organization: {
    id: '0195c8d0-2222-7000-91ab-000000000001',
    name: 'Kreasi Nusantara EO',
    slug: 'kreasi-nusantara',
    planName: 'Paket Pro EO',
    role: 'OWNER',
    memberCount: 18,
    activeEventCount: 3,
  },
  quota: {
    planName: 'Paket Pro EO',
    activeEventsUsed: 3,
    activeEventsLimit: 10,
    membersUsed: 18,
    membersLimit: 50,
  },
  metrics: {
    activeEvents: 3,
    eventsNeedAttention: 1,
    overdueTasksAcrossOrg: 4,
    totalCommittedBudgetIdr: 87_500_000,
  },
  upcomingEvents: [
    {
      id: '0195c8d0-3333-7000-91ab-000000000001',
      organizationId: '0195c8d0-2222-7000-91ab-000000000001',
      name: 'National Creative Conference 2027',
      slug: 'ncc-2027-jakarta',
      status: 'PREPARATION',
      readinessStatus: 'NEEDS_ATTENTION',
      timezone: 'ASIA_JAKARTA',
      startsAt: '2027-06-20T01:00:00.000Z',
      endsAt: '2027-06-20T10:00:00.000Z',
      venueName: 'Balai Kartini Exhibition Hall',
      city: 'Jakarta Selatan',
      taskCompletionPercent: 74,
      overdueTasksCount: 3,
      resourceConflictsCount: 1,
      plannedBudgetIdr: 120_000_000,
      actualBudgetIdr: 42_500_000,
    },
    {
      id: '0195c8d0-3333-7000-91ab-000000000002',
      organizationId: '0195c8d0-2222-7000-91ab-000000000001',
      name: 'Festival UMKM Pesisir Timur',
      slug: 'festival-umkm-makassar',
      status: 'READY',
      readinessStatus: 'READY',
      timezone: 'ASIA_MAKASSAR',
      startsAt: '2027-07-04T01:00:00.000Z',
      endsAt: '2027-07-04T11:30:00.000Z',
      venueName: 'Anjungan Pantai Losari',
      city: 'Makassar',
      taskCompletionPercent: 96,
      overdueTasksCount: 0,
      resourceConflictsCount: 0,
      plannedBudgetIdr: 65_000_000,
      actualBudgetIdr: 45_000_000,
    },
  ],
};

export function resolveMockResponse<T>(method: string, path: string): T | null {
  const cleanPath = path.split('?')[0] ?? path;

  if (method === 'POST' && cleanPath === '/api/v1/auth/login') {
    return MOCK_LOGIN_RESPONSE as T;
  }

  if (method === 'GET' && cleanPath === '/api/v1/users/me') {
    return MOCK_USER as T;
  }

  if (
    method === 'GET' &&
    /^\/api\/v1\/organizations\/[^/]+\/overview$/.test(cleanPath)
  ) {
    return MOCK_ORG_OVERVIEW as T;
  }

  return null;
}

import { z } from 'zod';
import { IdrAmountSchema } from '../common/indonesia';
import { OrgRoleSchema } from '../auth/auth.contract';
import { EventSummarySchema } from '../events/event.contract';

export const OrganizationSummarySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(80),
  planName: z.string().min(1),
  role: OrgRoleSchema,
  memberCount: z.number().int().nonnegative(),
  activeEventCount: z.number().int().nonnegative(),
});
export type OrganizationSummary = z.infer<typeof OrganizationSummarySchema>;

export const CreateOrganizationInputSchema = z.object({
  name: z
    .string()
    .min(3, 'Nama organisasi minimal 3 karakter')
    .max(120, 'Nama organisasi maksimal 120 karakter'),
  slug: z
    .string()
    .min(3, 'Slug URL minimal 3 karakter')
    .max(60, 'Slug URL maksimal 60 karakter')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug hanya boleh huruf kecil, angka, dan tanda hubung (-)',
    ),
});
export type CreateOrganizationInput = z.infer<
  typeof CreateOrganizationInputSchema
>;

export const OrganizationQuotaSchema = z.object({
  planName: z.string().min(1),
  activeEventsUsed: z.number().int().nonnegative(),
  activeEventsLimit: z.number().int().positive(),
  membersUsed: z.number().int().nonnegative(),
  membersLimit: z.number().int().positive(),
});
export type OrganizationQuota = z.infer<typeof OrganizationQuotaSchema>;

export const OrganizationOverviewSchema = z.object({
  organization: OrganizationSummarySchema,
  quota: OrganizationQuotaSchema,
  metrics: z.object({
    activeEvents: z.number().int().nonnegative(),
    eventsNeedAttention: z.number().int().nonnegative(),
    overdueTasksAcrossOrg: z.number().int().nonnegative(),
    totalCommittedBudgetIdr: IdrAmountSchema,
  }),
  upcomingEvents: z.array(EventSummarySchema),
});
export type OrganizationOverview = z.infer<typeof OrganizationOverviewSchema>;

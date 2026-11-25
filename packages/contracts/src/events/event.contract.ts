import { z } from 'zod';
import { IdrAmountSchema, IndonesiaTimezoneSchema } from '../common/indonesia';

export const EventStatusSchema = z.enum([
  'DRAFT',
  'PLANNING',
  'PREPARATION',
  'READY',
  'ONGOING',
  'COMPLETED',
  'CANCELLED',
  'ARCHIVED',
]);
export type EventStatus = z.infer<typeof EventStatusSchema>;

export const EventReadinessStatusSchema = z.enum([
  'READY',
  'NEEDS_ATTENTION',
  'BLOCKED',
]);
export type EventReadinessStatus = z.infer<typeof EventReadinessStatusSchema>;

export const EventSummarySchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  name: z.string().min(3).max(160),
  slug: z.string().min(2).max(100),
  status: EventStatusSchema,
  readinessStatus: EventReadinessStatusSchema,
  timezone: IndonesiaTimezoneSchema,
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  venueName: z.string().min(1),
  city: z.string().min(1),
  taskCompletionPercent: z.number().min(0).max(100),
  overdueTasksCount: z.number().int().nonnegative(),
  resourceConflictsCount: z.number().int().nonnegative(),
  plannedBudgetIdr: IdrAmountSchema,
  actualBudgetIdr: IdrAmountSchema,
});
export type EventSummary = z.infer<typeof EventSummarySchema>;

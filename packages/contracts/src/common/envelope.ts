import { z } from 'zod';

/**
 * Katalog kode error bisnis baku EventOps Indonesia.
 * Disinkronkan dengan docs/04-KONTRAK-API-DAN-INTEGRASI.md.
 */
export const ApiErrorCodeSchema = z.enum([
  'VALIDATION_ERROR',
  'UNAUTHORIZED_SESSION',
  'FORBIDDEN_INSUFFICIENT_ROLE',
  'RESOURCE_NOT_FOUND',
  'RESOURCE_BOOKING_CONFLICT',
  'TICKET_ALREADY_CHECKED_IN',
  'TICKET_NOT_ELIGIBLE',
  'EXPENSE_ALREADY_PAID',
  'EVENT_READINESS_OVERRIDE_REASON_REQUIRED',
  'EVENT_IS_ARCHIVED',
  'SUBSCRIPTION_QUOTA_EXCEEDED',
  'INTERNAL_SERVER_ERROR',
]);

export type ApiErrorCode = z.infer<typeof ApiErrorCodeSchema>;

export const ApiResponseMetaSchema = z.object({
  requestId: z.string().min(1),
  timestamp: z.string().min(1),
});

export type ApiResponseMeta = z.infer<typeof ApiResponseMetaSchema>;

export const ApiPaginationMetaSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  totalItems: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
  hasNextPage: z.boolean(),
});

export type ApiPaginationMeta = z.infer<typeof ApiPaginationMetaSchema>;

export const ApiErrorDetailSchema = z.object({
  field: z.string().min(1),
  issue: z.string().min(1),
});

export type ApiErrorDetail = z.infer<typeof ApiErrorDetailSchema>;

export const ApiErrorBodySchema = z.object({
  code: ApiErrorCodeSchema,
  message: z.string().min(1),
  details: z.array(ApiErrorDetailSchema).optional(),
});

export type ApiErrorBody = z.infer<typeof ApiErrorBodySchema>;

export const ApiErrorResponseSchema = z.object({
  success: z.literal(false),
  error: ApiErrorBodySchema,
  meta: ApiResponseMetaSchema,
});

export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;

/** Membentuk skema amplop sukses standar `/api/v1`. */
export function createApiSuccessSchema<T extends z.ZodType>(dataSchema: T) {
  return z.object({
    success: z.literal(true),
    data: dataSchema,
    meta: ApiResponseMetaSchema,
  });
}

/** Membentuk skema amplop daftar berhalaman standar `/api/v1`. */
export function createApiPaginatedSchema<T extends z.ZodType>(itemSchema: T) {
  return z.object({
    success: z.literal(true),
    data: z.array(itemSchema),
    meta: ApiPaginationMetaSchema,
  });
}

export type ApiSuccessResponse<TData> = {
  success: true;
  data: TData;
  meta: ApiResponseMeta;
};

export type ApiPaginatedResponse<TItem> = {
  success: true;
  data: TItem[];
  meta: ApiPaginationMeta;
};

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

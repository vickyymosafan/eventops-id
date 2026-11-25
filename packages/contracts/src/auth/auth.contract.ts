import { z } from 'zod';

export const OrgRoleSchema = z.enum(['OWNER', 'ADMIN', 'MEMBER']);
export type OrgRole = z.infer<typeof OrgRoleSchema>;

export const EventRoleSchema = z.enum([
  'EVENT_MANAGER',
  'DIVISION_LEADER',
  'COMMITTEE_MEMBER',
  'FINANCE_STAFF',
  'VIEWER',
]);
export type EventRole = z.infer<typeof EventRoleSchema>;

export const LoginInputSchema = z.object({
  email: z.string().email('Alamat email tidak valid'),
  password: z.string().min(8, 'Kata sandi minimal 8 karakter'),
});
export type LoginInput = z.infer<typeof LoginInputSchema>;

export const RegisterInputSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Nama lengkap minimal 2 karakter')
    .max(120, 'Nama lengkap maksimal 120 karakter'),
  email: z.string().email('Alamat email tidak valid'),
  password: z.string().min(8, 'Kata sandi minimal 8 karakter'),
});
export type RegisterInput = z.infer<typeof RegisterInputSchema>;

export const UserOrgMembershipSummarySchema = z.object({
  organizationId: z.string().uuid(),
  organizationName: z.string().min(1),
  organizationSlug: z.string().min(1),
  role: OrgRoleSchema,
});
export type UserOrgMembershipSummary = z.infer<
  typeof UserOrgMembershipSummarySchema
>;

export const AuthSessionUserSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string().min(1),
  email: z.string().email(),
  avatarUrl: z.string().url().nullable().optional(),
  organizations: z.array(UserOrgMembershipSummarySchema),
});
export type AuthSessionUser = z.infer<typeof AuthSessionUserSchema>;

export const LoginResponseDataSchema = z.object({
  accessToken: z.string().min(1),
  user: AuthSessionUserSchema,
});
export type LoginResponseData = z.infer<typeof LoginResponseDataSchema>;

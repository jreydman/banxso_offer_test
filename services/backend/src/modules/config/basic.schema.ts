import { z } from 'zod';

export const AppConfigSchema = z.object({
  appName: z.string(),
  appVersion: z.string(),
  appDomain: z.string(),
  appHostService: z.string(),
  appHTTPPort: z.coerce.number(),
  appTCPPort: z.coerce.number(),
  appLtsAPIVersion: z.string(),
  appHTTPUrl: z.string().url(),
});

export const CORSConfigSchema = z.object({
  origins: z.array(z.union([z.string().url(), z.literal('*')])),
});

export const SupabaseConfigSchema = z.object({
  publicUrl: z.string().url(),
  anonKey: z.string(),
  storageFileBucket: z.string(),
});

export const MailerConfigSchema = z.object({});

export const DatabaseConfigSchema = z.object({
  databaseUrl: z.string({}).url(),
});

export type AppConfigSchemaType = z.infer<typeof AppConfigSchema>;
export type CORSConfigSchemaType = z.infer<typeof CORSConfigSchema>;
export type SupabaseConfigSchemaType = z.infer<typeof SupabaseConfigSchema>;
export type MailerConfigSchemaType = z.infer<typeof MailerConfigSchema>;
export type DatabaseConfigSchemaType = z.infer<typeof DatabaseConfigSchema>;

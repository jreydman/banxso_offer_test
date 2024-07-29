import { ConfigModule, registerAs } from '@nestjs/config';
import {
  AppConfigSchema,
  AppConfigSchemaType,
  CORSConfigSchema,
  CORSConfigSchemaType,
  DatabaseConfigSchema,
  DatabaseConfigSchemaType,
  SupabaseConfigSchema,
  SupabaseConfigSchemaType,
} from './basic.schema';

export enum ConfigModuleNamespaces {
  APP_CONFIG = 'AppConfig',
  SUPABASE_CONFIG = 'SupabaseConfig',
  CORS_CONFIG = 'CorsConfig',
  DATABASE_CONFIG = 'DatabaseConfig',
  MAILER_CONFIG = 'MailerConfig',
}

const AppConfigRegistry = registerAs(ConfigModuleNamespaces.APP_CONFIG, () => {
  const values: Partial<AppConfigSchemaType> = {
    appName: process.env.npm_package_name,
    appVersion: process.env.npm_package_version,
    appDomain: process.env.BACKEND_DOMAIN,
    appHostService: process.env.BACKEND_HOST_SERVICE,
    appHTTPPort: Number(process.env.BACKEND_HTTP_PORT),
    appTCPPort: Number(process.env.BACKEND_TCP_PORT),
    appLtsAPIVersion: process.env.BACKEND_API_VERSION,
    appHTTPUrl: process.env.BACKEND_HTTP_URL,
  };

  return AppConfigSchema.parse(values);
});

const SupabaseConfigRegistry = registerAs(
  ConfigModuleNamespaces.SUPABASE_CONFIG,
  () => {
    const values: Partial<SupabaseConfigSchemaType> = {
      publicUrl: process.env.SUPABASE_PUBLIC_URL,
      anonKey: process.env.SUPABASE_ANON_KEY,
      storageFileBucket: process.env.SUPABASE_STORAGE_FILE_BUCKET,
    };

    return SupabaseConfigSchema.parse(values);
  }
);

const CorsConfigRegistry = registerAs(
  ConfigModuleNamespaces.CORS_CONFIG,
  () => {
    const values: Partial<CORSConfigSchemaType> = {
      origins: ['*'],
    };

    return CORSConfigSchema.parse(values);
  }
);

const DatabaseConfigRegistry = registerAs(
  ConfigModuleNamespaces.DATABASE_CONFIG,
  () => {
    const values: Partial<DatabaseConfigSchemaType> = {
      databaseUrl: process.env.DATABASE_URL,
    };

    return DatabaseConfigSchema.parse(values);
  }
);

export default ConfigModule.forRoot({
  load: [
    AppConfigRegistry,
    SupabaseConfigRegistry,
    CorsConfigRegistry,
    DatabaseConfigRegistry,
  ],
  isGlobal: true,
});

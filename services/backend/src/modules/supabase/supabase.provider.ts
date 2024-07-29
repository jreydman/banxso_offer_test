import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { ConfigModuleNamespaces } from '../config/config.module';

@Injectable()
export class SupabaseProvider {
  private supabaseClient: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    const supabaseConfig = this.configService.get(
      ConfigModuleNamespaces.SUPABASE_CONFIG
    );

    this.supabaseClient = createClient(
      supabaseConfig.publicUrl,
      supabaseConfig.anonKey
    );
  }

  get client(): SupabaseClient {
    return this.supabaseClient;
  }
}

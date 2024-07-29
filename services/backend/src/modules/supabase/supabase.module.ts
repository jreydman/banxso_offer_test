import { Module } from '@nestjs/common';
import { SupabaseProvider } from './supabase.provider';
import { SupabaseStorageService } from './supabase.storage';

@Module({
  providers: [SupabaseProvider, SupabaseStorageService],
  exports: [SupabaseStorageService, SupabaseProvider],
})
export class SupabaseModule {}

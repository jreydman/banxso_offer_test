import { Module } from '@nestjs/common';
import { FileBucketController } from './file_bucket.controller';
import { AuthModule } from '../auth/auth.module';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [AuthModule, SupabaseModule],
  controllers: [FileBucketController],
  providers: [],
})
export class FileBucketModule {}

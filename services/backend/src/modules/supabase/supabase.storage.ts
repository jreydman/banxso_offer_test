import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseProvider } from './supabase.provider';
import { ConfigService } from '@nestjs/config';
import { ConfigModuleNamespaces } from '../config/config.module';

@Injectable()
export class SupabaseStorageService {
  private fileBucketStorage: string;

  constructor(
    private readonly supabaseProvider: SupabaseProvider,
    private readonly configService: ConfigService
  ) {
    const supabaseConfig = this.configService.get(
      ConfigModuleNamespaces.SUPABASE_CONFIG
    );
    this.fileBucketStorage = supabaseConfig.storageFileBucket;
  }

  async uploadFile(file: Express.Multer.File, path: string): Promise<any> {
    const { data, error } = await this.supabaseProvider.client.storage
      .from(this.fileBucketStorage)
      .upload(path, file.buffer);

    if (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
    return data;
  }
}

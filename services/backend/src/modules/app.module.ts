import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { FileBucketModule } from './file_bucket/file_bucket.module';
import ConfigModule from './config/config.module';

@Module({
  imports: [ConfigModule, AuthModule, ChatModule, FileBucketModule],
})
export class AppModule {}

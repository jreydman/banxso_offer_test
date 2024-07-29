import {
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthStrategyEnum } from '../../utils/auth.enum';
import { SupabaseStorageService } from '../supabase/supabase.storage';
import { SupabaseProvider } from '../supabase/supabase.provider';

@Controller({
  path: 'file_bucket',
  version: '1',
})
export class FileBucketController {
  constructor(
    private readonly supabaseStorageService: SupabaseStorageService,
    private readonly supabaseProvider: SupabaseProvider
  ) {}

  @Post('upload')
  @UseGuards(AuthGuard(AuthStrategyEnum.jwtAuth))
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const user = await this.supabaseProvider.client.auth.signInWithPassword({
      email: 'pikj.reyderman@gmail.com',
      password: '1910310179Sasha',
    });
    const uid = user.data.user.id;
    console.log(uid);
    this.supabaseProvider.client.storage
      .from('file_bucket')
      .upload(
        `${'f78953f3-190b-426e-9633-7d063201f883'}/${file.originalname}`,
        file.buffer
      );

    return { file: file.originalname };
  }
}

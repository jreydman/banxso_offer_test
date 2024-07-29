import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppModule } from './modules/app.module';
import { ConfigModuleNamespaces } from './modules/config/config.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ZodValidationPipe());

  const configService = app.get(ConfigService);
  const appConfig = configService.get(ConfigModuleNamespaces.APP_CONFIG);
  const corsConfig = configService.get(ConfigModuleNamespaces.CORS_CONFIG);

  const document_config = new DocumentBuilder()
    .setTitle(appConfig.appName)
    .setVersion(appConfig.appVersion)
    .build();
  const document = SwaggerModule.createDocument(app, document_config);
  SwaggerModule.setup('docs', app, document);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.enableShutdownHooks();

  app.enableCors({
    origin: corsConfig.origins,
    credentials: true,
  });

  await app.listen(appConfig.appHTTPPort);
}

bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { VersioningType } from '@nestjs/common';
import { API_VERSION } from './common/constants/api-versions.constant';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    bufferLogs: true,
  });

  // Add CORS configuration
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const configService = app.get(ConfigService);
  const globalPrefix = configService.get<string>('env.apiPrefix') ?? 'api';
  app.setGlobalPrefix(globalPrefix);

  // Enable API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: API_VERSION.V1,
    prefix: 'api/v',
  });

  app.useGlobalPipes(new ValidationPipe());

  const port = configService.get<number>('env.port') ?? 3000;
  await app.listen(port);
}
bootstrap();

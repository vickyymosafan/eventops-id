import 'dotenv/config';
import 'reflect-metadata';
import { randomUUID } from 'node:crypto';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { AppModule } from './app.module';

export async function createApp(): Promise<NestFastifyApplication> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      genReqId: () => `req_${randomUUID()}`,
    }),
  );

  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: process.env['CORS_ORIGIN'] ?? 'http://localhost:3000',
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('EventOps Indonesia API')
    .setDescription(
      'Dokumentasi REST API EventOps Indonesia (/api/v1) menggunakan Zod DTO dari @eventops/contracts.',
    )
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();

  const openApiDoc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, cleanupOpenApiDoc(openApiDoc));

  return app;
}

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  const app = await createApp();
  const port = Number(process.env['PORT'] ?? 4000);

  await app.listen(port, '0.0.0.0');
  logger.log(`EventOps API berjalan di http://localhost:${port}/api/v1`);
  logger.log(`Swagger OpenAPI tersedia di http://localhost:${port}/docs`);
}

const isEntrypoint =
  process.argv[1]?.endsWith('main.ts') || process.argv[1]?.endsWith('main.js');

if (isEntrypoint) {
  void bootstrap();
}

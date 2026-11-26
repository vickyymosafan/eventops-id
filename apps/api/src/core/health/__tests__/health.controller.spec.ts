import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { randomUUID } from 'node:crypto';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Test } from '@nestjs/testing';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { AppModule } from '../../../app.module';
import { PrismaService } from '../../prisma/prisma.service';

describe('Backend Foundation (Health, Zod Validation, Envelope & Swagger)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    process.env['SKIP_DB_CONNECT'] = 'true';

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        ping: async () => true,
        onModuleInit: async () => undefined,
        onModuleDestroy: async () => undefined,
      })
      .compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter({
        genReqId: () => `req_${randomUUID()}`,
      }),
    );

    app.setGlobalPrefix('api/v1');

    const swaggerConfig = new DocumentBuilder()
      .setTitle('EventOps Indonesia API')
      .setVersion('0.1.0')
      .build();
    const openApiDoc = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, cleanupOpenApiDoc(openApiDoc));

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/health mengembalikan amplop sukses dan mengimpor @eventops/contracts', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/health',
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.success).toBe(true);
    expect(body.data.status).toBe('ok');
    expect(body.data.contractsLoaded).toBe(true);
    expect(body.data.supportedTimezones).toContain('Asia/Jakarta');
    expect(body.meta.requestId).toMatch(/^req_/);
  });

  it('GET /api/v1/health/db mengembalikan status database connected', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/health/db',
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.success).toBe(true);
    expect(body.data.database).toBe('connected');
  });

  it('POST /api/v1/health/echo-validate menolak payload tidak valid dengan VALIDATION_ERROR', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/health/echo-validate',
      payload: {
        email: 'bukan-email',
        password: '123',
      },
    });

    expect(res.statusCode).toBe(400);
    const body = res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('VALIDATION_ERROR');
    expect(Array.isArray(body.error.details)).toBe(true);
    expect(body.error.details.length).toBeGreaterThanOrEqual(2);
  });

  it('POST /api/v1/health/echo-validate menerima payload valid sesuai Zod schema', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/health/echo-validate',
      payload: {
        email: 'panitia@eventops.id',
        password: 'PasswordKuat123!',
      },
    });

    expect(res.statusCode).toBe(201);
    const body = res.json();
    expect(body.success).toBe(true);
    expect(body.data).toEqual({
      validated: true,
      email: 'panitia@eventops.id',
    });
  });

  it('GET /docs-json menyediakan dokumen OpenAPI Swagger', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/docs-json',
    });

    expect(res.statusCode).toBe(200);
    const doc = res.json();
    expect(doc.openapi).toBeDefined();
    expect(doc.paths['/api/v1/health']).toBeDefined();
    expect(doc.paths['/api/v1/health/echo-validate']).toBeDefined();
  });
});

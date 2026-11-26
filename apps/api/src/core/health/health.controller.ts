import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginInputSchema, TIMEZONE_META } from '@eventops/contracts';
import { createZodDto } from 'nestjs-zod';
import { PrismaService } from '../prisma/prisma.service';

export class HealthEchoValidationDto extends createZodDto(LoginInputSchema) {}

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({
    summary: 'Cek kesehatan layanan API',
    description:
      'Memastikan server NestJS Fastify berjalan dan paket @eventops/contracts dapat diimpor.',
  })
  @ApiResponse({ status: 200, description: 'Layanan API sehat.' })
  getHealth() {
    return {
      status: 'ok',
      service: 'eventops-api',
      supportedTimezones: Object.values(TIMEZONE_META).map((tz) => tz.iana),
      contractsLoaded: true,
    };
  }

  @Get('db')
  @ApiOperation({
    summary: 'Cek koneksi PostgreSQL via Prisma',
    description: 'Menjalankan query SELECT 1 ke PostgreSQL melalui PrismaService.',
  })
  @ApiResponse({ status: 200, description: 'Koneksi PostgreSQL aktif.' })
  @ApiResponse({ status: 503, description: 'PostgreSQL tidak dapat dijangkau.' })
  async getDatabaseHealth() {
    try {
      await this.prisma.ping();
      return {
        status: 'ok',
        database: 'connected',
      };
    } catch (error) {
      throw new ServiceUnavailableException({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Koneksi database PostgreSQL gagal.',
        details: [
          {
            field: 'database',
            issue: error instanceof Error ? error.message : String(error),
          },
        ],
      });
    }
  }

  @Post('echo-validate')
  @ApiOperation({
    summary: 'Uji validasi Zod DTO dari @eventops/contracts',
    description:
      'Endpoint sederhana untuk memverifikasi ZodValidationPipe dan format error standar.',
  })
  @ApiResponse({ status: 201, description: 'Input valid sesuai skema Zod.' })
  @ApiResponse({ status: 400, description: 'Validasi Zod gagal.' })
  echoValidate(@Body() body: HealthEchoValidationDto) {
    return {
      validated: true,
      email: body.email,
    };
  }
}

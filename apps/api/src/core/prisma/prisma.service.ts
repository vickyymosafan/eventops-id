import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(@Inject(ConfigService) configService: ConfigService) {
    const connectionString =
      configService.get<string>('DATABASE_URL') ??
      'postgresql://postgres:postgres@localhost:5432/eventops_dev';

    super({
      adapter: new PrismaPg({ connectionString }),
    });
  }

  async onModuleInit(): Promise<void> {
    if (process.env['SKIP_DB_CONNECT'] === 'true') {
      return;
    }

    try {
      await this.$connect();
      this.logger.log('Koneksi Prisma ke PostgreSQL berhasil');
    } catch (error) {
      this.logger.warn(
        `Gagal terhubung ke PostgreSQL saat startup: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  async ping(): Promise<boolean> {
    await this.$queryRaw`SELECT 1`;
    return true;
  }
}

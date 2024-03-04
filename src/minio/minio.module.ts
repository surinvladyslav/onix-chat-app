import { Module } from '@nestjs/common';
import { MinioConfigService } from './minio.config';
import { MinioService } from './minio.service';

@Module({
  providers: [MinioConfigService, MinioService],
  exports: [MinioService],
})
export class MinioModule {}

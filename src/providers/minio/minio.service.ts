import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';

@Injectable()
export class MinioService {
  private readonly minioClient: Client;
  private readonly logger = new Logger(MinioService.name);

  constructor(private readonly configService: ConfigService) {
    const minioConfig = this.configService.get('minio');

    this.minioClient = new Client({
      endPoint: minioConfig.endpoint,
      port: minioConfig.port,
      useSSL: minioConfig.useSSL,
      accessKey: minioConfig.accessKey,
      secretKey: minioConfig.secretKey,
    });
  }

  async uploadImage(file: any): Promise<string> {
    try {
      const fileName = `${Date.now()}-${file.originalname}`;
      await this.minioClient.putObject(
        this.configService.get('minio.bucketName'),
        fileName,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,
        },
      );
      return fileName;
    } catch (error) {
      this.logger.error(`Failed to upload image: ${error.message}`);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  async getImageUrl(fileName: string): Promise<string> {
    try {
      const presignedUrl = await this.minioClient.presignedGetObject(
        this.configService.get('minio.bucketName'),
        fileName,
      );

      return presignedUrl.replace('minio', 'localhost');
    } catch (error) {
      this.logger.error(`Failed to get image URL: ${error.message}`);
      throw new Error(`Failed to get image URL: ${error.message}`);
    }
  }

  async deleteImage(fileName: string): Promise<void> {
    try {
      await this.minioClient.removeObject(
        this.configService.get('minio.bucketName'),
        fileName,
      );
    } catch (error) {
      this.logger.error(`Failed to delete image: ${error.message}`);
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }
}

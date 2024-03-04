import { Injectable } from '@nestjs/common';
import { MinioConfigService } from './minio.config';
import { Client } from 'minio';

@Injectable()
export class MinioService {
  private readonly minioClient: Client;

  constructor(private readonly minioConfig: MinioConfigService) {
    this.minioClient = new Client({
      endPoint: this.minioConfig.endPoint,
      port: this.minioConfig.port,
      useSSL: this.minioConfig.useSSL,
      accessKey: this.minioConfig.accessKey,
      secretKey: this.minioConfig.secretKey,
    });
  }

  async uploadImage(file: any, fileName: string): Promise<void> {
    try {
      await this.minioClient.putObject(
        this.minioConfig.bucketName,
        fileName,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,
        },
      );
    } catch (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  async getImageUrl(fileName: string): Promise<string> {
    try {
      return this.minioClient.presignedGetObject(
        this.minioConfig.bucketName,
        fileName,
      );
    } catch (error) {
      throw new Error(`Failed to get image URL: ${error.message}`);
    }
  }

  async deleteImage(fileName: string): Promise<void> {
    try {
      await this.minioClient.removeObject(
        this.minioConfig.bucketName,
        fileName,
      );
    } catch (error) {
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }
}

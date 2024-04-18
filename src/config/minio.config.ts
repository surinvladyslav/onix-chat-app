import { registerAs } from '@nestjs/config';

export default registerAs('minio', () => ({
  endpoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT) || 9000,
  useSSL: process.env.MINIO_USE_SSL === 'true' || false,
  accessKey: process.env.MINIO_ACCESS_KEY || 'zpbjoHyx6LFIRoaEi4MD',
  secretKey: process.env.MINIO_SECRET_KEY || 'bC1kfCsLb3HNvQPFYPhUlXpatYHbbmrJZwfUdf5P',
  bucketName: process.env.MINIO_BUCKET_NAME || 'onix-chat-app',
}));

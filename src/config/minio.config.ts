import { registerAs } from '@nestjs/config';

const isDocker = process.env.DOCKER === 'true';

export default registerAs('minio', () => ({
  endpoint: process.env.MINIO_ENDPOINT || isDocker ? 'minio' : 'localhost',
  port: parseInt(process.env.MINIO_PORT) || 9000,
  useSSL: process.env.MINIO_USE_SSL === 'true' || false,
  accessKey: process.env.MINIO_ACCESS_KEY || 'MRPMJRUFJ1DflwU5Bhcy',
  secretKey: process.env.MINIO_SECRET_KEY || '0jg6J7Iq3RTqpscJVizzpfCt6ovli9PdYUwDMe8t',
  bucketName: process.env.MINIO_BUCKET_NAME || 'onix-chat-app',
}));

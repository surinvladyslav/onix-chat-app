import { Injectable } from '@nestjs/common';
import { RedisService as NestRedisService } from 'nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  private client: Redis;

  constructor(private readonly nestRedisService: NestRedisService) {
    this.client = this.nestRedisService.getClient();
  }

  async publish(channel: string, message: string): Promise<void> {
    await this.client.publish(channel, message);
  }

  async subscribe(
    channel: string,
    callback: (message: string) => void,
  ): Promise<void> {
    await this.client.subscribe(channel);
    this.client.on('message', (chnl, msg) => {
      if (chnl === channel) {
        callback(msg);
      }
    });
  }

  async unsubscribe(channel: string): Promise<void> {
    await this.client.unsubscribe(channel);
  }
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class MinioConfigService {
  public readonly endPoint: string = 'localhost';
  public readonly port: number = 9000;
  public readonly useSSL: boolean = false;
  public readonly accessKey: string = '3OzlBY3VMxRJa71hnil4';
  public readonly secretKey: string = 'EUqrvbKX3ePLV68YskQCU7geIdIlelUJ1jkxbXCn';
  public readonly bucketName: string = 'onix-chat-app';
}

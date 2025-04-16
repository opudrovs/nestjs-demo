import { Injectable } from '@nestjs/common';

/**
 * This service provides a simple hello world message.
 */
@Injectable()
export class AppService {
  getHello(): string {
    return 'NestJS API is running!';
  }
}

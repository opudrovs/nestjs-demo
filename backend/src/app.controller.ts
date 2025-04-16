import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { ApiExcludeController } from '@nestjs/swagger';

/**
 * AppController handles the root route and serves a simple hello world message.
 * It also handles the favicon.ico request by returning a 204 No Content response.
 */
@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('favicon.ico')
  handleFavicon(@Res() res: Response) {
    return res.status(204).end(); // No content
  }
}

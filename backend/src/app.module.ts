import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { PropertiesModule } from './properties/properties.module';

@Module({
  imports: [OrdersModule, PropertiesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

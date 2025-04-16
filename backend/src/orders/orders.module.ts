import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { PropertiesModule } from '../properties/properties.module';

/**
 * OrdersModule
 * This module is responsible for managing orders in the application.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Order]), PropertiesModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}

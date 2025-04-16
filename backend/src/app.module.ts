import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { PropertiesModule } from './properties/properties.module';
import { Property } from './properties/entities/property.entity';
import { Order } from './orders/entities/order.entity';

/**
 * The AppModule is the root module of the application.
 * It imports the necessary modules, including the configuration module,
 * TypeORM module for database connection, and feature modules for orders and properties.
 * It also defines the main controller and service for the application.
 */
@Module({
  imports: [
    // Load environment variables from .env file
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Configure TypeORM using env variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: parseInt(config.get<string>('DB_PORT', '5433')),
        username: config.get<string>('DB_USER', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'postgres'),
        database: config.get<string>('DB_NAME', 'nestjs_demo'),
        synchronize: false, // Do not auto-create tables in app
        entities: [Property, Order],
        autoLoadEntities: false,
      }),
    }),

    // Feature modules
    OrdersModule,
    PropertiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

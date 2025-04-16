import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { Property } from './entities/property.entity';

/**
 * PropertiesModule
 * This module is responsible for managing properties in the application.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Property])],
  controllers: [PropertiesController],
  providers: [PropertiesService],
  exports: [PropertiesService, TypeOrmModule],
})
export class PropertiesModule {}

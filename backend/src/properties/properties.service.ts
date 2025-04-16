import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property } from './entities/property.entity';
import { PropertyStatus } from '../common/enums/property-status.enum';

/**
 * PropertiesService handles the business logic related to properties.
 * It interacts with the database to create, read, update, and delete properties.
 */
@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertiesRepository: Repository<Property>,
  ) {}

  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    try {
      const property = this.propertiesRepository.create(createPropertyDto);
      return await this.propertiesRepository.save(property);
    } catch (err) {
      console.error('Create property failed:', err);
      throw new BadRequestException('Invalid input or DB error');
    }
  }

  async findAll(): Promise<Property[]> {
    return this.propertiesRepository.find({
      where: { status: Not(PropertyStatus.HIDDEN) },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Property> {
    const property = await this.propertiesRepository.findOne({
      where: {
        id,
        status: Not(PropertyStatus.HIDDEN),
      },
    });
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
    return property;
  }

  async update(
    id: number,
    updatePropertyDto: UpdatePropertyDto,
  ): Promise<Property> {
    const property = await this.findOne(id);
    const updated = this.propertiesRepository.merge(
      property,
      updatePropertyDto,
    );
    return this.propertiesRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const result = await this.propertiesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
  }
}

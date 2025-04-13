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

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}

  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    try {
      const property = this.propertyRepository.create(createPropertyDto);
      return await this.propertyRepository.save(property);
    } catch (err) {
      console.error('Create property failed:', err); // In a real-world app, use a logger to log the error
      throw new BadRequestException('Invalid input or DB error');
    }
  }

  async findAll(): Promise<Property[]> {
    return this.propertyRepository.find({
      where: { status: Not(PropertyStatus.HIDDEN) },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Property> {
    const property = await this.propertyRepository.findOne({ where: { id } });
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
    const updated = this.propertyRepository.merge(property, updatePropertyDto);
    return this.propertyRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const result = await this.propertyRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
  }
}

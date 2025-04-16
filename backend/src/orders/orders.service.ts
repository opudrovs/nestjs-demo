import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Property } from '../properties/entities/property.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PropertiesService } from '../properties/properties.service';
import { PropertyStatus } from '../common/enums/property-status.enum';

/**
 * OrdersService handles the business logic related to orders.
 * It interacts with the database to create, read, update, and delete orders.
 * It also manages the relationship between orders and properties.
 */
@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Property)
    private readonly propertiesRepository: Repository<Property>,
    private readonly propertiesService: PropertiesService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { propertyId, quantity } = createOrderDto;

    /**
     * Note: We inject PropertiesService instead of accessing the repository directly
     * to reuse existing business logic, such as filtering out hidden properties
     * in the `findOne` method.
     *
     * This keeps logic centralized and avoids duplication.
     * In larger applications, consider extracting shared logic to a separate
     * utility service to avoid tight coupling between feature services.
     */
    const property = await this.propertiesService.findOne(propertyId);
    if (!property) {
      throw new NotFoundException(`Property with ID ${propertyId} not found`);
    }

    if (property.status !== PropertyStatus.AVAILABLE) {
      throw new BadRequestException(
        'This property is not available for orders',
      );
    }

    if (property.availablePieces < quantity) {
      throw new BadRequestException(
        'Not enough available pieces to fulfill order',
      );
    }

    const order = this.ordersRepository.create({
      quantity,
      property,
    });

    const savedOrder = await this.ordersRepository.save(order);

    // Update property counts
    property.availablePieces -= quantity;
    property.soldPieces += quantity;
    await this.propertiesRepository.save(property);

    return savedOrder;
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['property'], // if you want to include the linked property
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['property'], // if you want to include the linked property
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  /**
   * Updates an existing order.
   *
   * WARNING:
   * This method does not validate business logic such as:
   * - Whether the property associated with the order still exists or is available
   * - Whether increasing the quantity exceeds available property pieces
   *
   * Use with caution if exposing this endpoint to external users,
   * or extend the logic to include proper validation.
   */
  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    const updated = this.ordersRepository.merge(order, updateOrderDto);
    return this.ordersRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const result = await this.ordersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }
}

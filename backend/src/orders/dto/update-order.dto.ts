import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';

/**
 * DTO for updating an order.
 * This class extends the CreateOrderDto class, allowing for partial updates to the order.
 */
export class UpdateOrderDto extends PartialType(CreateOrderDto) {}

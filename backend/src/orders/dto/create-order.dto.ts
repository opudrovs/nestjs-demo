import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

/**
 * DTO for creating an order.
 * This class defines the structure of the data required to create a new order.
 * It includes validation rules to ensure the data is in the correct format.
 */
export class CreateOrderDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the property the user wants to invest in',
  })
  @IsInt()
  @Min(1)
  propertyId: number;

  @ApiProperty({
    example: 5,
    minimum: 1,
    description: 'Number of property pieces to purchase',
  })
  @IsInt()
  @Min(1)
  quantity: number;
}

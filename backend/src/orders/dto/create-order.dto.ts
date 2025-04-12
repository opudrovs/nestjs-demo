import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    example: 'property-abc123',
    description: 'ID of the property the user wants to invest in',
  })
  propertyId: string;

  @ApiProperty({
    example: 5,
    minimum: 1,
    description: 'Number of property pieces to purchase',
  })
  quantity: number;
}

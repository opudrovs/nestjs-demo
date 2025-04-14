import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    example: 'property-abc123',
    description: 'ID of the property the user wants to invest in',
  })
  @IsString()
  propertyId: string;

  @ApiProperty({
    example: 5,
    minimum: 1,
    description: 'Number of property pieces to purchase',
  })
  @IsInt()
  quantity: number;
}

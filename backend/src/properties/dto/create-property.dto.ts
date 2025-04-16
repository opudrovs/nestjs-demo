import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, Min, IsString } from 'class-validator';
import { PropertyStatus } from '../../common/enums/property-status.enum';

/**
 * DTO for creating a property.
 * This class defines the structure of the data required to create a new property.
 * It includes validation rules to ensure the data is in the correct format.
 */
export class CreatePropertyDto {
  @ApiProperty({
    example: 'Berlin',
    description: 'City where the property is located',
  })
  @IsString()
  city: string;

  @ApiProperty({
    example: '123 Main St, Berlin',
    description: 'Full street address of the property',
  })
  @IsString()
  address: string;

  @ApiProperty({
    example: 100,
    description: 'Total number of pieces this property is divided into',
  })
  @IsInt()
  @Min(1)
  totalPieces: number;

  @ApiProperty({
    example: 100,
    description: 'Number of unsold pieces currently available for purchase',
  })
  @IsInt()
  @Min(0)
  availablePieces: number;

  @ApiProperty({
    example: 0,
    description: 'Number of pieces that have already been sold',
  })
  @IsInt()
  @Min(0)
  soldPieces: number;

  @ApiProperty({
    example: 5000,
    description: 'Price per piece (in smallest currency unit, e.g., cents)',
  })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'Must be a number' },
  )
  @Min(0.01)
  unitPrice: number;

  @ApiProperty({
    example: PropertyStatus.AVAILABLE,
    enum: PropertyStatus,
    description: 'Status of the property',
  })
  @IsEnum(PropertyStatus)
  status: PropertyStatus;
}

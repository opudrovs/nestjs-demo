import { ApiProperty } from '@nestjs/swagger';

export class CreatePropertyDto {
  @ApiProperty({
    example: 'Berlin',
    description: 'City where the property is located',
  })
  city: string;

  @ApiProperty({
    example: '123 Main St, Berlin',
    description: 'Full street address of the property',
  })
  address: string;

  @ApiProperty({
    example: 100,
    description: 'Total number of pieces this property is divided into',
  })
  totalPieces: number;

  @ApiProperty({
    example: 100,
    description: 'Number of unsold pieces currently available for purchase',
  })
  availablePieces: number;

  @ApiProperty({
    example: 0,
    description: 'Number of pieces that have already been sold',
  })
  soldPieces: number;

  @ApiProperty({
    example: 5000,
    description: 'Price per piece (in smallest currency unit, e.g., cents)',
  })
  unitPrice: number;

  @ApiProperty({
    example: 'available',
    enum: ['available', 'not_available', 'hidden'],
    description: 'Status of the property',
  })
  status: 'available' | 'not_available' | 'hidden';
}

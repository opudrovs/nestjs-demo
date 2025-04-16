import { PartialType } from '@nestjs/mapped-types';
import { CreatePropertyDto } from './create-property.dto';

/**
 * DTO for updating a property.
 * This class extends the CreatePropertyDto class, allowing for partial updates to the property.
 */
export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {}

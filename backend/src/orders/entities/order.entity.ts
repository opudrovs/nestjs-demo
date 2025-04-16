import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Property } from '../../properties/entities/property.entity';

/**
 * Order entity representing an order in the system.
 * Each order is associated with a specific property.
 */
@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Property)
  property: Property;
}

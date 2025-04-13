import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { PropertyStatus } from '../../common/enums/property-status.enum';

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  city: string;

  @Column()
  address: string;

  @Column()
  totalPieces: number;

  @Column()
  availablePieces: number;

  @Column()
  soldPieces: number;

  @Column()
  unitPrice: number;

  @Column({
    type: 'enum',
    enum: PropertyStatus,
    default: PropertyStatus.AVAILABLE,
  })
  status: PropertyStatus;

  @OneToMany(() => Order, (order) => order.property)
  orders: Order[];
}

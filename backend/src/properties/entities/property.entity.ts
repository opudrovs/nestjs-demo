import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

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

  @Column()
  status: 'available' | 'not_available' | 'hidden';

  @OneToMany(() => Order, (order) => order.property)
  orders: Order[];
}

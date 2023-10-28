// order-status.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  dateTime: Date;

  @Column()
  type: string;

  @ManyToOne((type) => Order, (order) => order.statuses)
  @JoinColumn({ name: 'order_id' })
  order: Order;
}

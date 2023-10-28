// order.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { OrderStatus, OrderStatusTypes } from './order-status.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Driver } from 'src/driver/entities/driver.entity';
import { Tariff } from 'src/tariff/entities/tariff.entity';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cargoDescription: string;

  @Column()
  origin: string;

  @Column()
  destination: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  weight: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  volume: number;

  @ManyToOne((type) => Customer, (customer) => customer.orders)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne((type) => Driver, (driver) => driver.orders)
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;

  @OneToMany((type) => OrderStatus, (orderStatus) => orderStatus.order)
  statuses: OrderStatus[];

  @ManyToOne(() => Tariff)
  @JoinColumn({ name: 'tariff_id' })
  tariff: Tariff;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'jsonb', nullable: false })
  originCoordinates: Coordinates;

  @Column({ type: 'jsonb', nullable: false })
  destinationCoordinates: Coordinates;
}

import { Roles } from 'src/core/enums/roles.enum';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IDX_EMAIL', { unique: true })
  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  // @Column()
  // firstName: string;

  // @Column()
  // lastName: string;

  @Column()
  password: string;

  // @Column()
  // birthDate: Date;

  @Column({ default: Roles.USER })
  role: Roles;

  @Index('IDX_TOKEN')
  @Column({ nullable: true })
  token?: string;
}

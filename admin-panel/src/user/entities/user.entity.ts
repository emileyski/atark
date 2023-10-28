import { Roles } from 'src/core/enums/roles.enum';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('users')
export class User {
  // @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn()
  id: string;

  @Index('IDX_EMAIL', { unique: true })
  @Column({ unique: true })
  email: string;

  @Column({ default: Roles.CUSTOMER })
  role: Roles;

  @Column()
  name: string;
}

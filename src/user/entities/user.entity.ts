import { Entity, Column, PrimaryGeneratedColumn, Index, OneToMany } from 'typeorm';
import { Role } from '../enums/role.enum';
import { Invoice } from '../../invoice/entities/invoice.entity';
import { Status } from '../enums/status.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ name: "idUser" })
  id!: number;

  @Column({ length: 200, nullable: true})
  lastName: string;

  @Column({ length: 200, nullable: true})
  firstName: string;

  @Column({ nullable: true })
  street: number;

  @Column({ nullable: true })
  town: string;

  @Column({ nullable: true })
  postalCode: number;

  @Column({ nullable: true })
  subscriptionId: string;

  @Index({ unique: true })
  @Column({ length: 150 })
  email: string;

  @Index()
  @Column({ length: 150 })
  hash: string;

  @Column({ type: "enum", enum: Role, default: Role.Spectator })
  role: Role;

  @Column({ type: "enum", enum: Status, default: Status.Verified})
  status: Status;

  @Column({ nullable: true })
  stripeCustomerId: string;

  @Column({ nullable: true })
  passwordResetToken: string;

  @Column({ type: 'timestamp', nullable: true })
  passwordResetExpires: Date;

  @OneToMany(() => Invoice, invoice => invoice.user)
  invoice: Invoice[];
}
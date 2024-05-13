import { Entity, Column, PrimaryGeneratedColumn, Index, OneToMany } from 'typeorm';
import { Role } from '../enums/role.enum';
import { Invoice } from '../../invoice/entities/invoice.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ name: "idUser" })
  id!: number;

  @Column({ length: 200 })
  lastName: string;

  @Column({ length: 200 })
  firstName: string;

  @Column()
  street: number;

  @Column()
  town: string;

  @Column()
  postalCode: number;

  @Index({ unique: true })
  @Column({ length: 150 })
  email: string;

  @Index()
  @Column({ length: 150 })
  hash: string;

  @Column({ type: "enum", enum: Role, default: Role.Spectator })
  role: Role;

  @Column({ nullable: true })
  passwordResetToken: string;

  @Column({ type: 'timestamp', nullable: true })
  passwordResetExpires: Date;

  @OneToMany(() => Invoice, invoice => invoice.user)
  invoice: Invoice[];
}
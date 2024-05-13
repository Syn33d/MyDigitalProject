import { Invoice } from '../../invoice/entities/invoice.entity';
import { Magazine } from '../../magazine/entities/magazine.entity';
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Subscription {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    price: number;

    @Column()
    description: string;

    @OneToMany(() => Invoice, invoice => invoice.subscriptions)
    invoices: Invoice[];

    @ManyToMany(() => Magazine, magazine => magazine.subscriptions)
    magazines: Magazine[];
}

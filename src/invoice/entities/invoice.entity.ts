import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PaymentMethod } from "../enums/paymentMethodEnum";
import { PaymentStatus } from "../enums/paymentStatusEnum";
import { User } from "../../user/entities/user.entity";
import { Subscription } from "../../subscription/entities/subscription.entity";

@Entity()
export class Invoice {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    totalAmount: string;

    @Column()
    billingDate: Date;

    @Column({
        type: "enum",
        enum: PaymentMethod,
        default: PaymentMethod.VIREMENT_BANCAIRE
    })
    paymentMethod: PaymentMethod;

    @Column({
        type: "enum",
        enum: PaymentStatus,
        default: PaymentStatus.PENDING
    })
    paymentStatus: PaymentStatus;

    @OneToMany(() => User, user => user.invoices)
    users: User[];

    @OneToMany(() => Subscription, subscription => subscription.invoices)
    subscriptions: Subscription[];
}
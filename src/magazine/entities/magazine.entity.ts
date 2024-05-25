import { Article } from '../../article/entities/article.entity';
import { CollaborationMagazine } from '../../collaborationMagazine/entities/collaborationMagazine.entity';
import { Subscription } from '../../subscription/entities/subscription.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class Magazine {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    date: Date;

    @Column()
    type: string;

    @Column()
    description: string;

    @Column()
    priceId: string;

    @OneToMany(() => CollaborationMagazine, collaborationMagazine => collaborationMagazine.magazine)
    collaborationsMagazine: CollaborationMagazine[];

    @OneToMany(() => Article, article => article.magazine)
    article: Article[];

    @ManyToMany(() => Subscription, subscription => subscription.magazine)
    subscription: Subscription[];
}

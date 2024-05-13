import { Article } from 'src/article/entities/article.entity';
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

    @OneToMany(() => CollaborationMagazine, collaborationMagazine => collaborationMagazine.magazines)
    collaborationsMagazines: CollaborationMagazine[];

    @OneToMany(() => Article, article => article.magazines)
    articles: Article[];

    @ManyToMany(() => Subscription, subscription => subscription.magazines)
    subscriptions: Subscription[];
}

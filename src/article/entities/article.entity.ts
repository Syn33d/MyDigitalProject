import { Magazine } from "../../magazine/entities/magazine.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column()
    isFree: boolean;

    @Column()
    isBlocked: boolean;

    @ManyToOne(() => Magazine, magazine => magazine.article)
    magazine: Magazine;
}

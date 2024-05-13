import { Magazine } from "src/magazine/entities/magazine.entity";
import { Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @ManyToOne(() => Magazine, magazine => magazine.articles)
    magazines: Magazine;
}

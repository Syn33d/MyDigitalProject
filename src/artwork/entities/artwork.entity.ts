import { Artist } from "../../artist/entities/artist.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Artwork {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    content: string;

    @ManyToMany(() => Artist, artist => artist.artworks)
    artists: Artist[];
}

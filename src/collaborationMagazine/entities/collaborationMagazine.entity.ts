import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Magazine } from "../../magazine/entities/magazine.entity";
import { Artist } from "../../artist/entities/artist.entity";

@Entity()
export class CollaborationMagazine {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    dateCollaboration: Date;

    @ManyToOne(() => Magazine, magazine => magazine.collaborationsMagazine)
    magazine: Magazine;

    @ManyToOne(() => Artist, artist => artist.collaborationsMagazine)
    artist: Artist;
}
import { Artwork } from '../../artwork/entities/artwork.entity';
import { CollaborationMagazine } from '../../collaborationMagazine/entities/collaborationMagazine.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Artist {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    lastName: string;

    @Column()
    firstName: string;

    @Column()
    street: number;

    @Column()
    town: string;

    @Column()
    postalCode: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToMany(() => CollaborationMagazine, collaborationMagazine => collaborationMagazine.artists)
    collaborationsMagazines: CollaborationMagazine[];
    
    @ManyToMany(() => Artwork, artwork => artwork.artists)
    artworks: Artwork[];
}
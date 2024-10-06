import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pokemon')
export class PokemonEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    pokemonId: number;

    @Column()
    photo: string;

    @Column("simple-array")
    types: string[];
}
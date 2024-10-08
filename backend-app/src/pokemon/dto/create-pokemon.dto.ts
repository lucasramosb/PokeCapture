import { IsNotEmpty, MinLength, Matches } from 'class-validator';

export class CreatePokemonDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @MinLength(5)
    @Matches(/^[a-zA-Z\s]+$/)
    pokemonNickname: string;

    @IsNotEmpty()
    pokemonId: number;

    @IsNotEmpty()
    photo: string;

    @IsNotEmpty()
    types: string[];
}
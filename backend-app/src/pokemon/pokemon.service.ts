import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs';
import { Repository } from 'typeorm';
import { PokemonEntity } from '../pokemon/entities/pokemon.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PokemonService {

    constructor(
        private readonly httpService: HttpService,

        @InjectRepository(PokemonEntity)
        private readonly pokemonRepository: Repository<PokemonEntity>
    ){}

    async getPokemonRandon(){
        //Gerar um ID aleatório entre 1 e 151, referente a pokemons da primeira geração
        const pokemonId = Math.floor(Math.random() * 151) + 1;

        const reposnse = await this.httpService.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`).pipe(map(response => response.data)).toPromise();
        
        const pokemon: PokemonEntity = {
            name: reposnse.name,
            id: reposnse.id,
            photo: reposnse.sprites.front_default,
            types: reposnse.types.map((type) => type.type.name)
        };
        return pokemon;
  }
}
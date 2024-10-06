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
          id: undefined,
          name: reposnse.name,
          pokemonId: reposnse.id,
          photo: reposnse.sprites.front_default,
          types: reposnse.types.map((type) => type.type.name)
      };
      return pokemon;
  }

  async capturePokemon(pokemon: PokemonEntity): Promise<PokemonEntity> {
      const newPokemon = this.pokemonRepository.create({
          name: pokemon.name,
          pokemonId: pokemon.pokemonId,
          photo: pokemon.photo,
          types: pokemon.types
      });
      return await this.pokemonRepository.save(newPokemon);
  }

}
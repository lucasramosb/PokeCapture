import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { map } from 'rxjs';
import { ILike, Repository } from 'typeorm';
import { PokemonEntity } from '../pokemon/entities/pokemon.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePokemonDto } from './dto/create-pokemon.dto';

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
          pokemonNickname: undefined,
          pokemonId: reposnse.id,
          photo: reposnse.sprites.front_default,
          types: reposnse.types.map((type) => type.type.name)
      };
      return pokemon;
  }

  async capturePokemon(pokemon: CreatePokemonDto): Promise<PokemonEntity> {

    await this.validatePokemonNickName(pokemon.pokemonNickname);

    return this.pokemonRepository.save(pokemon);
  }

  async releasePokemon(id: number): Promise<void> {
    
    const result = await this.pokemonRepository.delete(id);

    if (result.affected === 0) {
        throw new NotFoundException(`Pokémon with ID ${id} not found`);
    }
  }

  async getPokemonsCaptured(): Promise<CreatePokemonDto[]> {
    
    return this.pokemonRepository.find();
  }

  async checkPokemonNickname(nickname: string): Promise<boolean> {
    const existPokemon = await this.pokemonRepository.findOne({
      where: {pokemonNickname: ILike(nickname)}
    })

    return !!existPokemon;
  }

  async validatePokemonNickName(pokemonNickname: string): Promise<void> {
    const nameRegex = /^[a-zA-Z\s]+$/;

    if (!pokemonNickname) {
      throw new BadRequestException('O nome não pode estar vazio.');
    }

    if (pokemonNickname.length < 5) {
      throw new BadRequestException('O nome deve ter mais de 5 caracteres.');
    }

    if (!nameRegex.test(pokemonNickname)) {
      throw new BadRequestException('O nome deve conter apenas letras.');
    }

    const existPokemon = await this.pokemonRepository.findOne({
      where: {pokemonNickname: ILike(pokemonNickname)}
    })
    if (existPokemon) {
      throw new BadRequestException('Já existe um Pokémon com esse nome.');
    }
  }

}
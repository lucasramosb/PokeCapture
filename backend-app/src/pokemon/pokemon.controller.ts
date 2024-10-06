import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { Repository } from 'typeorm';
import { PokemonEntity } from '../pokemon/entities/pokemon.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('pokemon')
export class PokemonController {
  constructor(
    private readonly pokemonService: PokemonService,

    @InjectRepository(PokemonEntity)
    private readonly pokemonRepository: Repository<PokemonEntity>
  ) {}

  @Get()
  async getPokemons(pokemon: PokemonEntity) {
    return this.pokemonService.getPokemonRandon();
  }

  @Post('capture')
  async capturePokemon(@Body() pokemon: PokemonEntity): Promise<PokemonEntity> {
    return this.pokemonService.capturePokemon(pokemon);
  }

  @Delete('release/:id')
  async releasePokemon(@Param('id') id: number): Promise<void> {
    return this.pokemonService.releasePokemon(id);
  }

}
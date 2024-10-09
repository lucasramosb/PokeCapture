import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { Repository } from 'typeorm';
import { PokemonEntity } from '../pokemon/entities/pokemon.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePokemonDto } from './dto/create-pokemon.dto';

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
  async capturePokemon(@Body() pokemon: CreatePokemonDto): Promise<PokemonEntity> {
    return this.pokemonService.capturePokemon(pokemon);
  }

  @Delete('release/:id')
  async releasePokemon(@Param('id') id: number): Promise<void> {
    return this.pokemonService.releasePokemon(id);
  }

  @Get('captured')
  async getPokemonsCaptured(): Promise<CreatePokemonDto[]> {
    return this.pokemonService.getPokemonsCaptured();
  }

  @Get('check-nickname/:nickname')
  async checkPokemonNickname(@Param('nickname') nickname: string): Promise<boolean> {
    return this.pokemonService.checkPokemonNickname(nickname);
  }

}
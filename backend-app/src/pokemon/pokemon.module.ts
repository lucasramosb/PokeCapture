import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonEntity } from './entities/pokemon.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([PokemonEntity]) ,HttpModule],
  controllers: [PokemonController],
  providers: [PokemonService],
})
export class PokemonModule {}

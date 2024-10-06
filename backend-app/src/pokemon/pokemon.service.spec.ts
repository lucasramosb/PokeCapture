import { Test, TestingModule } from '@nestjs/testing';
import { PokemonService } from './pokemon.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PokemonEntity } from '../pokemon/entities/pokemon.entity';
import { Repository } from 'typeorm';
import { find, of } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { NotFoundException } from '@nestjs/common';

describe('PokemonService', () => {
  let service: PokemonService;
  let repository: Repository<PokemonEntity>;

  const mockPokemonRepository = {
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
  };

  const mockHttpService = {
    get: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
        { provide: getRepositoryToken(PokemonEntity), useValue: mockPokemonRepository },
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    service = module.get<PokemonService>(PokemonService);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPokemonRandon', () => {
    it('should return a random pokemon', async () => {
      const pokemonResponse = {
        id: 1,
        name: 'bulbasaur',
        sprites: { front_default: 'bulbasaur_image_url' },
        types: [{ type: { name: 'grass' } }],
      };

      mockHttpService.get.mockReturnValue(of({ data: pokemonResponse }));

      const randomPokemon = await service.getPokemonRandon();

      expect(randomPokemon).toEqual({
        name: 'bulbasaur',
        photo: 'bulbasaur_image_url',
        types: ['grass'],
        pokemonId: 1,
      });
      expect(mockHttpService.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('capturePokemon', () => {
    it('should capture and save a pokemon', async () => {
      const pokemon: PokemonEntity = {
        id: 1,
        name: 'bulbasaur',
        photo: 'bulbasaur_image_url',
        types: ['grass'],
        pokemonId: 1,
      };

      mockPokemonRepository.create.mockReturnValue(pokemon);
      mockPokemonRepository.save.mockResolvedValue(pokemon);

      const result = await service.capturePokemon(pokemon);

      expect(mockPokemonRepository.create).toHaveBeenCalledWith({
        name: pokemon.name,
        pokemonId: pokemon.pokemonId,
        photo: pokemon.photo,
        types: pokemon.types,
      });
      expect(mockPokemonRepository.save).toHaveBeenCalledWith(pokemon);
      expect(result).toEqual(pokemon);
    });
  });

  describe('releasePokemon', () => {
    it('should release (delete) a pokemon', async () => {
      const id = 1;

      mockPokemonRepository.delete.mockResolvedValue({ affected: 1 });
  
      await service.releasePokemon(id);

      expect(mockPokemonRepository.delete).toHaveBeenCalledWith(id);
    });
  
    it('should throw NotFoundException if the pokemon does not exist', async () => {
      const id = 1;

      mockPokemonRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.releasePokemon(id)).rejects.toThrow(
        new NotFoundException(`Pokémon with ID ${id} not found`)
      );
  
      expect(mockPokemonRepository.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('getPokemonsCaptured', () => {
    it('should return an array of captured Pokemons', async () => {
      const pokemons: PokemonEntity[] = [
        {
          id: 1,
          name: 'bulbasaur',
          photo: 'bulbasaur_image_url',
          types: ['grass'],
          pokemonId: 1,
        },
        {
          id: 2,
          name: 'charmander',
          photo: 'charmander_image_url',
          types: ['fire'],
          pokemonId: 2,
        },
      ];

      mockPokemonRepository.find.mockResolvedValue(pokemons);

      const result = await service.getPokemonsCaptured();

      expect(mockPokemonRepository.find).toHaveBeenCalledTimes(1); // Verifica se find foi chamado
      expect(result).toEqual(pokemons); // Verifica se o resultado é igual ao array de pokemons
    });
  });


});
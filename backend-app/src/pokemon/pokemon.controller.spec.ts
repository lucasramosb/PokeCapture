import { Test, TestingModule } from '@nestjs/testing';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PokemonEntity } from '../pokemon/entities/pokemon.entity';
import { NotFoundException } from '@nestjs/common';

describe('PokemonController', () => {
  let controller: PokemonController;
  let service: PokemonService;

  const mockPokemonService = {
    getPokemonRandon: jest.fn(),
    capturePokemon: jest.fn(),
    releasePokemon: jest.fn(),
    getPokemonsCaptured: jest.fn(),
  };

  const mockPokemonRepository = {
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonController],
      providers: [
        { provide: PokemonService, useValue: mockPokemonService },
        { provide: getRepositoryToken(PokemonEntity), useValue: mockPokemonRepository },
      ],
    }).compile();

    controller = module.get<PokemonController>(PokemonController);
    service = module.get<PokemonService>(PokemonService);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe ('getPokemonRandon', () =>{
    it('should return a random pokemon', async () => {
      const pokemon: PokemonEntity = {
        id: 1,
        name: 'bulbasaur',
        photo: 'bulbasaur_image_url',
        types: ['grass'],
        pokemonId: 0,
      };
  
      mockPokemonService.getPokemonRandon.mockResolvedValue(pokemon);
  
      await controller.getPokemons(pokemon);
  
      expect(mockPokemonService.getPokemonRandon).toHaveBeenCalledTimes(1);
    });
  })

  describe ('capturePokemon', () =>{
    it('should capture a pokemon', async () => {
      const pokemon: PokemonEntity = {
        id: 1,
        name: 'bulbasaur',
        photo: 'bulbasaur_image_url',
        types: ['grass'],
        pokemonId: 0,
      };
  
      mockPokemonService.capturePokemon.mockResolvedValue(pokemon);
  
      await controller.capturePokemon(pokemon);
  
      expect(mockPokemonService.capturePokemon).toHaveBeenCalledTimes(1);
      expect(mockPokemonService.capturePokemon).toHaveBeenCalledWith(pokemon);
    });
  })

  describe('releasePokemon', () => {
    it('should call service to release a pokemon', async () => {
      const id = 1;

      mockPokemonService.releasePokemon.mockResolvedValue(undefined);

      await controller.releasePokemon(id);

      expect(mockPokemonService.releasePokemon).toHaveBeenCalledWith(id);
      expect(mockPokemonService.releasePokemon).toHaveBeenCalledTimes(1);
    });
  
    it('should throw NotFoundException if the pokemon does not exist', async () => {
      const id = 1;

      mockPokemonService.releasePokemon.mockRejectedValue(
        new NotFoundException(`Pokémon with ID ${id} not found`)
      );

      await expect(controller.releasePokemon(id)).rejects.toThrow(
        new NotFoundException(`Pokémon with ID ${id} not found`)
      );

      expect(mockPokemonService.releasePokemon).toHaveBeenCalledWith(id);
      expect(mockPokemonService.releasePokemon).toHaveBeenCalledTimes(1);
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

      mockPokemonService.getPokemonsCaptured.mockResolvedValue(pokemons);

      const result = await controller.getPokemonsCaptured();

      expect(mockPokemonService.getPokemonsCaptured).toHaveBeenCalledTimes(1);
      expect(result).toEqual(pokemons);
    });
  });
});
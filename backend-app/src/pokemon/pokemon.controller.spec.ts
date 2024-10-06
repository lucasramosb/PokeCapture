import { Test, TestingModule } from '@nestjs/testing';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PokemonEntity } from '../pokemon/entities/pokemon.entity';

describe('PokemonController', () => {
  let controller: PokemonController;
  let service: PokemonService;

  const mockPokemonService = {
    getPokemonRandon: jest.fn(),
    capturePokemon: jest.fn(),
  };

  const mockPokemonRepository = {
    create: jest.fn(),
    save: jest.fn(),
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
});

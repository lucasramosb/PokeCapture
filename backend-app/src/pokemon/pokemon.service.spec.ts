import { Test, TestingModule } from '@nestjs/testing';
import { PokemonService } from './pokemon.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PokemonEntity } from '../pokemon/entities/pokemon.entity';
import { Repository } from 'typeorm';
import { of } from 'rxjs';
import { HttpService } from '@nestjs/axios';

describe('PokemonService', () => {
  let service: PokemonService;
  let repository: Repository<PokemonEntity>;

  const mockPokemonRepository = {
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
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

});

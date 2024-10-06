import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PokemonEntity } from '../src/pokemon/entities/pokemon.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PokemonController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<PokemonEntity>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    repository = moduleFixture.get<Repository<PokemonEntity>>(getRepositoryToken(PokemonEntity));
  });

  afterEach(async () => {
    await repository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/pokemon/capture (POST) should capture a pokemon', async () => {
    const newPokemon = {
      name: 'Pikachu',
      pokemonId: 25,
      photo: 'pikachu-photo-url',
      types: ['electric'],
    };

    const response = await request(app.getHttpServer())
      .post('/pokemon/capture')
      .send(newPokemon)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toEqual(newPokemon.name);
  });

  it('/pokemon/release/:id (DELETE) should release a pokemon', async () => {

    const pokemon = await repository.save({
      name: 'Charmander',
      pokemonId: 4,
      photo: 'charmander-photo-url',
      types: ['fire'],
    });

    const response = await request(app.getHttpServer())
    .delete(`/pokemon/release/${pokemon.id}`)
    .expect(200);

    const deletedPokemon = await repository.findOne({ where: { id: pokemon.id } });
    expect(deletedPokemon).toBeNull();
  });

  it('/pokemon/captured (GET) should return captured pokemons', async () => {
    
    await repository.save([
      { name: 'Bulbasaur', pokemonId: 1, photo: 'bulbasaur-photo-url', types: ['grass', 'poison'] },
      { name: 'Squirtle', pokemonId: 7, photo: 'squirtle-photo-url', types: ['water'] },
    ]);

    const response = await request(app.getHttpServer())
      .get('/pokemon/captured')
      .expect(200);

    expect(response.body.length).toBe(2);
    expect(response.body[0].name).toEqual('Bulbasaur');
    expect(response.body[1].name).toEqual('Squirtle');
  });
});
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Container from '../components/container/container'; 
import styles from './pokemons.module.css';
import { FaArrowsRotate } from "react-icons/fa6";
import axios from 'axios';

type Pokemon = {
  name: string;
  pokemonId: number;
  photo: string;
  types: string[];
};

export default function PokemonPage() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);

  const fetchRandomPokemon = async () => {
    try{
      const response = await axios.get<Pokemon>('http://localhost:3001/pokemon')
      setPokemon(response.data);
    }catch(error){
      console.error('Erro ao buscar Pokémon', error);
    }
  };

  useEffect(() => {
    fetchRandomPokemon();
  }, []);

  if (!pokemon) {
    return <p>Carregando Pokémon...</p>;
  }

  return (
    <div className={styles.pokemonPage}>
        <Container>
            <div className={styles.pokemonImageContainer}>
                <Image
                  src={pokemon.photo}
                  alt={pokemon.name}
                  width={200}
                  height={200}
                  className={styles.pokemonImage}
                />
            </div>

            <div className={styles.pokemonContainer}>
                <h2>{pokemon.name}</h2>
            </div>

            <p className={styles.pokemonTypes}>
                {pokemon.types.join(' ')}
            </p>

            <div className={styles.buttons}>
                <a href="" className={styles.iconContainer}>
                    <FaArrowsRotate size={40} onClick={fetchRandomPokemon} className={styles.icon}/>
                    <span>Novo Pokémon</span>
                </a>
                <a href="" className={styles.iconContainer}>
                    <Image 
                      src="/pokeballCapture.png"
                      alt="Capturar Pokémon"
                      width={75}
                      height={75}
                    />
                    <span>Capturar</span>
                </a>
                <a href="" className={styles.iconContainer}>
                    <Image 
                      src="/pokedex.png"
                      alt="Meus Pokémons"
                      width={75}
                      height={75}
                    />
                    <span>Meus Pokémons</span>
                </a>
              </div>
        </Container>
    </div>
    
  );
}
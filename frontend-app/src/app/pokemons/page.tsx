'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Container from '../components/container/container'; 
import styles from './pokemons.module.css';
import { FaArrowsRotate } from "react-icons/fa6";
import axios from 'axios';
import pokemonTypeColors from '../utils/pokemonTypeColor';
import { toast } from 'react-toastify';
import { CgPokemon } from "react-icons/cg";

type Pokemon = {
  name: string;
  pokemonId: number;
  photo: string;
  types: string[];
};

export default function PokemonPage() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRandomPokemon = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Pokemon>('http://localhost:3001/pokemon');

      setPokemon(response.data);
    } catch (error) {
      console.error('Erro ao buscar Pokémon', error);

      toast.error("Erro ao capturar Pokémon. Tente novamente.", {
        position: "bottom-center",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCapturePokemon = async () => {
    if (!pokemon) return;
    setLoading(true);

    try {
      await axios.post<Pokemon>('http://localhost:3001/pokemon/capture', pokemon);
      toast.success(`Pokémon ${pokemon.name} capturado com sucesso!`, {
        position: "bottom-center",
        autoClose: 5000,
      });

      await new Promise(resolve => setTimeout(resolve, 1500));

      setPokemon(null);
      
      fetchRandomPokemon();
    } catch (error) {
      console.error('Erro ao capturar Pokémon', error);

      toast.error("Erro ao capturar Pokémon. Tente novamente.", {
        position: "bottom-center",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomPokemon();
  }, []);

  if (!pokemon) {
    return <div className={styles.loadingIcon}> <CgPokemon size={50} /> </div>
  }

  return (
    <div>
      {loading ? (
        <div className={styles.loadingIcon}>
          <CgPokemon size={50} />
        </div>
      ) : (
        <div className={styles.pokemonPage}>
          <Container>
            <div className={styles.pokemonContainer}>
              <h2>{pokemon.name}</h2>
            </div>

            <div className={styles.pokemonImageContainer}>
              <Image
                src={pokemon.photo}
                alt={pokemon.name}
                width={200}
                height={200}
                className={styles.pokemonImage}
              />
            </div>

            <div>
              {pokemon.types.map((type) => (
                <span
                  key={type}
                  className={styles.type}
                  style={{ backgroundColor: pokemonTypeColors[type] || '#777' }}
                >
                  {type}
                </span>
              ))}
            </div>

            <div className={styles.buttons}>
              <a className={styles.iconContainer}>
                <FaArrowsRotate size={45} onClick={fetchRandomPokemon} className={styles.icon} />
                <span>Novo Pokémon</span>
              </a>
              <a onClick={handleCapturePokemon} className={styles.iconContainer}>
                <Image
                  src="/pokeballCapture.png"
                  alt="Capturar Pokémon"
                  width={75}
                  height={75}
                />
                <span>Capturar</span>
              </a>
              <a href="/my-pokemons" className={styles.iconContainer}>
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
      )}
    </div>
  );
}
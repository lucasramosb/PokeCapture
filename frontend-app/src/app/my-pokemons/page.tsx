'use client';

import { useEffect, useState } from 'react';
import styles from './myPokemons.module.css';
import Container from '../components/container/container';
import Button from '../components/button/button';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { TfiArrowCircleLeft, TfiArrowCircleRight } from 'react-icons/tfi';
import { toast } from 'react-toastify'
import { CgPokemon } from 'react-icons/cg';

type Pokemon = {
  id: number;
  name: string;
  pokemonId: number;
  photo: string;
};

export default function MyPokemons() {
  const [myPokemons, setMyPokemons] = useState<Pokemon[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  
  const PAGE_SIZE = 4; // Número de Pokémons por página

  const fetchMyPokemons = async () => {
    try {
      const response = await axios.get<Pokemon[]>('http://localhost:3001/pokemon/captured');
      setMyPokemons(response.data);
    } catch (error) {
      console.error('Erro ao buscar meus Pokémons', error);
    }
  };

  useEffect(() => {
    fetchMyPokemons();
  }, []);

  const handleReleasePokemon = async (id: number, name: string) => {
    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:3001/pokemon/release/${id}`);
      toast.success(`${name} foi solto com sucesso!`, {
        position: "top-right",
        autoClose: 5000,
      });
      await new Promise(resolve => setTimeout(resolve, 500));

      fetchMyPokemons();
    } catch (error) {
      console.error('Erro ao soltar Pokémon', error);
      toast.success(`Erro ao soltar Pokemon!`, {
        position: "top-right",
        autoClose: 5000,
      });
    }finally {
      setIsLoading(false);
    }
  };

  const findPokemons = () => {
    router.push('/pokemons');
  };

  const totalPages = Math.ceil(myPokemons.length / PAGE_SIZE);
  const displayedPokemons = myPokemons.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  return (
    <div>
      {isLoading ? (
        <div className={styles.loadingIcon}>
          <CgPokemon size={50} />
        </div>
      ): (
        <div className={styles.myPokemonPage}>
          <Container>
            <div className={styles.pokemonTitle}>
              <h2>Meus Pokémons</h2>
            </div>
            <table className={styles.pokemonTable}>
              <thead>
                <tr></tr>
              </thead>
              <tbody>
                {displayedPokemons.map((pokemon, index) => (
                  <tr key={pokemon.id} className={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                    <td>
                      <Image
                        src={pokemon.photo}
                        alt={pokemon.name}
                        width={50}
                        height={50}
                        className={styles.pokemonImage}
                      />
                    </td>
                    <td>{pokemon.name}</td>
                    <td>
                      <button
                        className={styles.buttonRelease}
                        onClick={() => handleReleasePokemon(pokemon.id, pokemon.name)}
                      >
                        Soltar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.pagination}>
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
              >
                <TfiArrowCircleLeft size={25} color="gray" />
              </button>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1}
              >
                <TfiArrowCircleRight size={25} color="gray" />
              </button>
            </div>
            <Button text="Encontrar Pokémons" onClick={findPokemons} />
          </Container>
        </div>
        )}
    </div>
  );

}
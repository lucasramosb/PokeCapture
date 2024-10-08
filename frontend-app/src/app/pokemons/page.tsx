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
import { Modal } from '../components/modal/page';
import Button from '../components/button/button';
import { Pokemon } from '@/types/pokemon-types';

export default function PokemonPage() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [pokemonNickName, setPokemonNickName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchRandomPokemon = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Pokemon>('http://localhost:3001/pokemon');

      setPokemon(response.data);
      setPokemonNickName('');
      setErrorMessage('');
    } catch (error) {
      console.error('Erro ao buscar Pokémon', error);

      toast.error("Erro ao encontrar Pokémon. Tente novamente.", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const validatePokemonNickName = async (name: string): Promise<boolean> => {
    const nameRegex = /^[a-zA-Z\s]+$/;

    if (!name) {
      setErrorMessage('O nome não pode estar vazio.');
      return false;
    }

    if (name.length < 5) {
      setErrorMessage('O nome deve ter mais de 5 caracteres.');
      return false;
    }

    if (!nameRegex.test(name)) {
      setErrorMessage('O nome deve conter apenas letras.');
      return false;
    }

    //verificar se o nickname já existe no banco de dados
    try {
      const response = await axios.get(`http://localhost:3001/pokemon/check-nickname/${name}`);
      if (response.data === true) {
        setErrorMessage('Já existe um Pokémon com esse nome.');
        return false;
      }
    } catch (error) {
      console.error('Erro ao verificar nome do Pokémon:', error);
      setErrorMessage('Erro ao verificar o nome. Tente novamente.');
      return false;
    }

    setErrorMessage('');
    return true;
  };

  const handleCapturePokemon = async () => {

    const isValidNickName = await validatePokemonNickName(pokemonNickName);
  
    if (!pokemon) {
      toast.error("Pokémon não encontrado. Tente novamente.", {
        position: "bottom-center",
        autoClose: 5000,
      });
      return;
    }

    if (isValidNickName) {
      //atribui o nickname ao pokemon
      const newPokemon = { ...pokemon, pokemonNickname: pokemonNickName };

      setLoading(true);
      closeModal();

      try {
        await axios.post<Pokemon>('http://localhost:3001/pokemon/capture', newPokemon);
        
        toast.success(`Pokémon ${pokemon.name} capturado com sucesso!`, {
          position: "top-right",
          autoClose: 5000,
        });

        setPokemon(null);
        setPokemonNickName('');
        fetchRandomPokemon();
      } catch (error) {
        console.error('Erro ao capturar Pokémon:', error);
        toast.error("Erro ao capturar Pokémon. Tente novamente.", {
          position: "bottom-center",
          autoClose: 5000,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchRandomPokemon();
  }, []);

  const closeModal = () => {
    setModalOpen(false);
  };

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
                  style={{ backgroundColor: pokemonTypeColors[type]}}
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
              <a onClick={()=> setModalOpen(true)} className={styles.iconContainer}>
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

      {isModalOpen && (
        <Modal onClose={closeModal}>
            <h2 className={styles.pokemonNameModal}>{pokemon.name}</h2>
            <Image
                src={pokemon.photo}
                alt={pokemon.name}
                width={150}
                height={150}
              />
            <span>Qual será o nome do seu Pokémon?</span>
            <input
              className={ errorMessage ? styles.inputError : styles.inputPokemonName}
              type="text"
              placeholder='Nome do seu Pokémon'
              value={pokemonNickName}
              onChange={(e) => setPokemonNickName(e.target.value)}
            />
            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
            <Button text="Capturar" onClick={handleCapturePokemon} />
        </Modal>
      )}

    </div>
    
  );
}